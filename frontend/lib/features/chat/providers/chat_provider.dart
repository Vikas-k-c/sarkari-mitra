import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sarkari_mitra/core/api/api_client.dart';
import 'package:sarkari_mitra/core/localization/locale_provider.dart';

final chatProvider = StateNotifierProvider<ChatNotifier, ChatState>((ref) {
  final locale = ref.watch(localeProvider);
  return ChatNotifier(ref.read(apiClientProvider), locale);});
  class ChatState {
  final String? sessionId;
  final List<ChatMessage> messages;
  final bool isLoading;
  final String? error;
  
  ChatState({this.sessionId, this.messages = const [], this.isLoading = false, this.error});
  ChatState copyWith({String? sessionId, List<ChatMessage>? messages, bool? isLoading, String? error, bool clearError = false}) {
    return ChatState(
      sessionId: sessionId ?? this.sessionId,
      messages: messages ?? this.messages,
      isLoading: isLoading ?? this.isLoading,
      error: clearError ? null : (error ?? this.error),
    );
  }
}

class ChatMessage {
  final String role;
  final String content;
  ChatMessage({required this.role, required this.content});
  }

class ChatNotifier extends StateNotifier<ChatState> {
  final ApiClient _api;
  final String _locale;

  ChatNotifier(this._api, this._locale) : super(ChatState()) {
    _addSystemMessage(_getInitialMessage(_locale));
  }

  String _getInitialMessage(String locale) {
    switch (locale) {
      case 'hi':
        return "नमस्ते! मैं सरकारी मित्र हूँ, आपका एआई (AI) सहायक। मैं आज आपको सरकारी योजनाओं को खोजने में कैसे मदद कर सकता हूँ?";
      case 'en':
      default:
        return "Hello! I am Sarkari Mitra, your AI assistant. How can I help you discover government schemes today?";
    }
  }

  void _addSystemMessage(String msg) {
    state = state.copyWith(messages: [...state.messages, ChatMessage(role: 'ai', content: msg)]);
  }

  Future<bool> initSession() async {
    if (state.sessionId != null) return true;

    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final response = await _api.post('/chat/sessions', {'language': _locale});
  state = state.copyWith(
        sessionId: response['data']['id'],
        isLoading: false,
      );
      return true;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      return false;
    }
  }

  Future<void> sendMessage(String text) async {
    if (text.trim().isEmpty) return;

    // Try initializing if we don't have a session
    if (state.sessionId == null) {
      final success = await initSession();
      if (!success) return; // Error is already in state
    }

    // Optimistically add user message
    final newMessages = [...state.messages, ChatMessage(role: 'user', content: text)];
    state = state.copyWith(messages: newMessages, isLoading: true, clearError: true);

    try {
      final response = await _api.post('/chat/sessions/${state.sessionId}/message', {
        'message': text,
        'language': _locale,});
  final aiMessage = ChatMessage(role: 'ai', content: response?['data']?['content'] ?? 'Error: Empty response');
      state = state.copyWith(
        messages: [...newMessages, aiMessage],
        isLoading: false,
      );
    } catch (e) {
      // Remove the optimistic user message if the network fails completely, or keep it and show error?
      // Let's keep the message but show error.
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  void clearError() {
    state = state.copyWith(clearError: true);
  }
}
