import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import '../providers/chat_provider.dart';
import '../services/voice_service.dart';
import 'package:sarkari_mitra/core/localization/locale_provider.dart';

class ChatScreen extends ConsumerStatefulWidget {
  const ChatScreen({super.key});
  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
  final _textController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _isListening = false;

  @override
  void initState() {
    super.initState();
    Future.microtask(() => ref.read(chatProvider.notifier).initSession());
    Future.microtask(() => ref.read(voiceServiceProvider).init());
  }

  @override
  void dispose() {
    ref.read(voiceServiceProvider).cancelListening();
    _textController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    if (_scrollController.hasClients) {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent + 100,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    }
  }

  void _toggleListening() async {
    final voiceService = ref.read(voiceServiceProvider);
    final locale = ref.read(localeProvider);
    
    String speechLocale = 'en_IN';
    if (locale == 'hi') speechLocale = 'hi_IN';

    if (_isListening) {
      await voiceService.stopListening();
      if (mounted) setState(() => _isListening = false);
      if (_textController.text.isNotEmpty && _textController.text != "Listening...") {
        _sendMessage();
      } else {
        _textController.clear();
      }
    } else {
      if (mounted) setState(() => _isListening = true);
      _textController.text = "Listening...";
      
      bool _isFinalProcessed = false;

      final started = await voiceService.startListening(
        preferredLocale: speechLocale,
        onResult: (text, isFinal) async {
          if (!mounted) return;
          setState(() {
            _textController.text = text;
          });
          
          if (isFinal && !_isFinalProcessed) {
            _isFinalProcessed = true;
            await voiceService.stopListening();
            
            // Wait briefly for UI sync
            await Future.delayed(const Duration(milliseconds: 300));
            
            if (mounted) {
              setState(() => _isListening = false);
              if (_textController.text.isNotEmpty && _textController.text != "Listening...") {
                debugPrint('[STT] Message Sent automatically');
                _sendMessage();
              } else {
                _textController.clear();
              }
            }
          }
        },
        onStatus: (status) {
          if (status == 'done' && !_isFinalProcessed) {
            if (mounted) {
              setState(() => _isListening = false);
              if (_textController.text.isNotEmpty && _textController.text != "Listening...") {
                // If it just stopped without a final flag, send whatever we have
                _sendMessage();
              } else if (_textController.text == "Listening...") {
                _textController.clear();
              }
            }
          } else if (status == 'notListening' && !_isFinalProcessed && _textController.text == "Listening...") {
             if (mounted) {
              setState(() => _isListening = false);
              _textController.clear();
             }
          }
        },
        onError: (errorMsg) {
          if (mounted) {
            setState(() => _isListening = false);
            _textController.clear();
            
            String displayError = 'Speech error: $errorMsg';
            if (errorMsg.contains('error_no_match')) {
              displayError = 'Could not hear anything clearly. Please try again.';
            } else if (errorMsg.contains('error_network')) {
              displayError = 'Network error during speech recognition.';
            } else if (errorMsg.contains('permission_denied')) {
              displayError = 'Microphone permission denied. Please enable it in settings.';
            } else if (errorMsg.contains('speech_unavailable')) {
              displayError = 'Speech Services unavailable. Please install Google Speech Recognition.';
            }
            
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(displayError), backgroundColor: Colors.redAccent),
            );
          }
        }
      );
      
      if (!started && mounted) {
        setState(() => _isListening = false);
        _textController.clear();
      }
    }
  }

  void _sendMessage() {
    if (_textController.text.trim().isEmpty) return;
    ref.read(chatProvider.notifier).sendMessage(_textController.text);
    _textController.clear();
    Future.delayed(const Duration(milliseconds: 100), _scrollToBottom);
  }

  void _speakMessage(String text) {
    final voiceService = ref.read(voiceServiceProvider);
    final locale = ref.read(localeProvider);
    String ttsLocale = 'en-IN';
    if (locale == 'hi') ttsLocale = 'hi'; // TTS often works better with just the language code
    
    // Clean text by stripping markdown symbols and punctuations that sound weird
    final cleanText = text.replaceAll(RegExp(r'[*#:`_~;\-\n]'), ' ').replaceAll(RegExp(r'\s+'), ' ').trim();
    voiceService.speak(cleanText, ttsLocale);
  }

  @override
  Widget build(BuildContext context) {
    final chatState = ref.watch(chatProvider);

    // Listen for errors
    ref.listen<ChatState>(chatProvider, (prev, next) {
      if (next.error != null && (prev?.error != next.error)) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(next.error!.replaceAll('Exception: ', '')),
            backgroundColor: Colors.redAccent,
          ),
        );
        ref.read(chatProvider.notifier).clearError();
      }
      if (next.messages.length > (prev?.messages.length ?? 0)) {
        Future.delayed(const Duration(milliseconds: 100), _scrollToBottom);
      }});
  return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        title: const Row(
          children: [
            Icon(Icons.smart_toy, color: Colors.blue),
            SizedBox(width: 8),
            Text('Ask AI Mitra', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.black87)),
          ],
        ),
        backgroundColor: Colors.white,
        elevation: 1,
        iconTheme: const IconThemeData(color: Colors.black87),
        actions: [
          IconButton(
            icon: const Icon(Icons.volume_off, color: Colors.grey),
            tooltip: 'Stop Speaking',
            onPressed: () => ref.read(voiceServiceProvider).stopSpeaking(),
          )
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
              itemCount: chatState.messages.length,
              itemBuilder: (context, index) {
                final msg = chatState.messages[index];
                final isUser = msg.role == 'user';
                return _buildMessageBubble(msg, isUser, context);
              },
            ),
          ),
          if (chatState.isLoading)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 24.0),
              child: Row(
                children: [
                  const SizedBox(
                    width: 16,
                    height: 16,
                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.blue),
                  ),
                  const SizedBox(width: 12),
                  Text('AI Mitra is typing...', style: TextStyle(color: Colors.grey.shade600, fontStyle: FontStyle.italic)),
                ],
              ),
            ),
          _buildInputArea(context, chatState),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(ChatMessage msg, bool isUser, BuildContext context) {
    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: isUser ? Colors.blue.shade600 : Colors.white,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(20),
            topRight: const Radius.circular(20),
            bottomLeft: isUser ? const Radius.circular(20) : Radius.zero,
            bottomRight: isUser ? Radius.zero : const Radius.circular(20),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            )
          ],
        ),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.85),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (!isUser) 
              MarkdownBody(
                data: msg.content,
                styleSheet: MarkdownStyleSheet(
                  p: const TextStyle(fontSize: 16, color: Colors.black87, height: 1.4),
                  strong: const TextStyle(fontWeight: FontWeight.bold, color: Colors.black),
                ),
              ) 
            else 
              Text(
                msg.content, 
                style: const TextStyle(fontSize: 16, color: Colors.white, height: 1.4),
              ),
            if (!isUser) ...[
              const SizedBox(height: 12),
              Row(
                children: [
                  InkWell(
                    onTap: () => _speakMessage(msg.content),
                    borderRadius: BorderRadius.circular(20),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.blue.shade50,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.volume_up, size: 16, color: Colors.blue),
                          SizedBox(width: 4),
                          Text('Read Aloud', style: TextStyle(fontSize: 12, color: Colors.blue, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  InkWell(
                    onTap: () => ref.read(voiceServiceProvider).stopSpeaking(),
                    borderRadius: BorderRadius.circular(20),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.red.shade50,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.stop_circle, size: 16, color: Colors.red),
                          SizedBox(width: 4),
                          Text('Stop', style: TextStyle(fontSize: 12, color: Colors.red, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ]
          ],
        ),
      ),
    );
  }

  Widget _buildInputArea(BuildContext context, ChatState chatState) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, -5))
        ],
      ),
      child: SafeArea(
        child: Row(
          children: [
            GestureDetector(
              onTap: _toggleListening,
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: _isListening 
                      ? [Colors.red.shade400, Colors.red.shade700]
                      : [Colors.blue.shade400, Colors.blue.shade700],
                  ),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.mic, color: Colors.white, size: 24),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.grey.shade300),
                ),
                child: TextField(
                  controller: _textController,
                  decoration: InputDecoration(
                    hintText: _isListening ? 'Listening...' : 'Type your question...',
                    border: InputBorder.none,
                    hintStyle: TextStyle(color: Colors.grey.shade500),
                  ),
                  onSubmitted: (_) => _sendMessage(),
                ),
              ),
            ),
            const SizedBox(width: 12),
            IconButton(
              icon: const Icon(Icons.send_rounded, size: 28),
              color: Colors.blue.shade700,
              onPressed: chatState.isLoading ? null : _sendMessage,
            ),
          ],
        ),
      ),
    );
  }
}
