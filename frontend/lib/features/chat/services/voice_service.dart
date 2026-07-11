import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:speech_to_text/speech_to_text.dart';
import 'package:flutter_tts/flutter_tts.dart';

final voiceServiceProvider = Provider<VoiceService>((ref) {
  return VoiceService();
});

class VoiceService {
  final SpeechToText _speechToText = SpeechToText();
  final FlutterTts _flutterTts = FlutterTts();
  
  bool _isSpeechInitialized = false;
  bool _isInitializing = false;
  bool _isSpeechAvailable = false;

  Future<bool> init() async {
    if (_isSpeechInitialized) return _isSpeechAvailable;
    if (_isInitializing) return false;
    
    _isInitializing = true;
    debugPrint('[STT] Initializing');
    
    try {
      _isSpeechInitialized = await _speechToText.initialize(
        onError: (error) {
          debugPrint('[STT] Initialization Failed: ${error.errorMsg}');
        },
        onStatus: (status) {
          debugPrint('[STT] Status Changes: $status');
        },
      );
      
      _isSpeechAvailable = _speechToText.isAvailable;
      
      if (_isSpeechInitialized && _isSpeechAvailable) {
        debugPrint('[STT] Initialization Success');
        debugPrint('[STT] Speech Available');
      } else {
        debugPrint('[STT] Initialization Failed or Speech Recognition Unavailable');
      }
      
      if (!kIsWeb) {
        try {
          await _flutterTts.setSharedInstance(true);
          await _flutterTts.setIosAudioCategory(IosTextToSpeechAudioCategory.playback,
              [IosTextToSpeechAudioCategoryOptions.defaultToSpeaker]);
        } catch (e) {
          debugPrint('[STT] TTS Config Warning: $e');
        }
      }
          
      return _isSpeechAvailable;
    } catch (e) {
      debugPrint('[STT] Initialization Failed: $e');
      _isSpeechAvailable = false;
      return false;
    } finally {
      _isInitializing = false;
    }
  }

  Future<void> speak(String text, String languageCode) async {
    String targetLang = languageCode.isNotEmpty ? languageCode : 'en-IN';
    try {
      final languages = await _flutterTts.getLanguages;
      if (languages != null && languages is List) {
        final List<String> availableLangs = languages.map((e) => e.toString()).toList();
        if (!availableLangs.contains(targetLang)) {
          final prefix = targetLang.split('-').first;
          final fallback = availableLangs.firstWhere(
            (l) => l.startsWith(prefix), 
            orElse: () => availableLangs.contains('en-US') ? 'en-US' : availableLangs.first
          );
          targetLang = fallback;
        }
      }
    } catch (_) {}
    await _flutterTts.setLanguage(targetLang);
    await _flutterTts.speak(text);
  }

  Future<void> stopSpeaking() async {
    await _flutterTts.stop();
  }

  Future<bool> startListening({
    required Function(String text, bool isFinal) onResult,
    required String preferredLocale,
    Function(String)? onStatus, 
    Function(String)? onError,
  }) async {
    if (!_isSpeechInitialized) {
      final success = await init();
      if (!success) {
        if (onError != null) {
          onError("speech_unavailable: Google Speech Recognition Services are missing or denied.");
        }
        return false;
      }
    }
    
    if (!_isSpeechAvailable) {
      if (onError != null) {
        onError("speech_unavailable: Google Speech Recognition Services are unavailable.");
      }
      return false;
    }
    
    // Resolve locale
    String selectedLocale = '';
    try {
      var locales = await _speechToText.locales();
      List<String> localeIds = locales.map((l) => l.localeId).toList();
      debugPrint('[STT] Available Locales: ${localeIds.take(10).join(', ')}... (${localeIds.length} total)');
      
      if (localeIds.contains(preferredLocale)) {
        selectedLocale = preferredLocale;
      } else if (localeIds.contains('en_IN')) {
        debugPrint('[STT] Fallback Reason: $preferredLocale not found, trying en_IN');
        selectedLocale = 'en_IN';
      } else if (localeIds.contains('en_US')) {
        debugPrint('[STT] Fallback Reason: Preferred & en_IN not found, trying en_US');
        selectedLocale = 'en_US';
      } else if (localeIds.isNotEmpty) {
        debugPrint('[STT] Fallback Reason: Falling back to first available locale');
        selectedLocale = localeIds.first;
      }
      debugPrint('[STT] Selected Locale: $selectedLocale');
    } catch (e) {
      debugPrint('[STT] Failed to resolve locales: $e');
    }

    debugPrint('[STT] Listening Started');

    _speechToText.statusListener = (status) {
      debugPrint('[STT] Status Changes: $status');
      if (onStatus != null) onStatus(status);
    };
    
    _speechToText.errorListener = (error) {
      debugPrint('[STT] Error: ${error.errorMsg}');
      if (onError != null) onError(error.errorMsg);
    };
    
    await _speechToText.listen(
      onResult: (result) {
        debugPrint('[STT] Raw Result -> Words: "${result.recognizedWords}", Confidence: ${result.confidence}, Final: ${result.finalResult}');
        if (result.finalResult) {
          debugPrint('[STT] Final Result');
        } else {
          debugPrint('[STT] Partial Result');
        }
        onResult(result.recognizedWords, result.finalResult);
      },
      localeId: selectedLocale.isNotEmpty ? selectedLocale : null,
      cancelOnError: true,
      listenMode: ListenMode.dictation,
      partialResults: true,
      pauseFor: const Duration(seconds: 3), // timeout on silence
      listenFor: const Duration(seconds: 30),
    );
    
    return true;
  }

  Future<void> stopListening() async {
    await _speechToText.stop();
  }

  Future<void> cancelListening() async {
    await _speechToText.cancel();
  }
}
