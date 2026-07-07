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

  Future<void> init() async {
    _isSpeechInitialized = await _speechToText.initialize();
    await _flutterTts.setSharedInstance(true);
    await _flutterTts.setIosAudioCategory(IosTextToSpeechAudioCategory.playback,
        [IosTextToSpeechAudioCategoryOptions.defaultToSpeaker]);
  }

  Future<void> speak(String text, String languageCode) async {
    String targetLang = languageCode.isNotEmpty ? languageCode : 'en-IN';
    try {
      final languages = await _flutterTts.getLanguages;
      if (languages != null && languages is List) {
        final List<String> availableLangs = languages.map((e) => e.toString()).toList();
        if (!availableLangs.contains(targetLang)) {
          // If hi-IN or hi isn't found exactly, try to find the closest match starting with 'hi'
          final prefix = targetLang.split('-').first;
          final fallback = availableLangs.firstWhere(
            (l) => l.startsWith(prefix), 
            orElse: () => availableLangs.contains('en-US') ? 'en-US' : availableLangs.first
          );
          targetLang = fallback;
        }
      }
    } catch (_) {
      // Ignore errors in fetching languages, fallback to original
    }
    await _flutterTts.setLanguage(targetLang);
    await _flutterTts.speak(text);
  }

  Future<void> stopSpeaking() async {
    await _flutterTts.stop();
  }

  Future<void> startListening(Function(String) onResult, String languageCode, {Function(String)? onStatus}) async {
    if (!_isSpeechInitialized) {
      await init();
    }
    if (_isSpeechInitialized) {
      _speechToText.statusListener = (status) {
        if (onStatus != null) onStatus(status);
      };
      await _speechToText.listen(
        onResult: (result) {
          onResult(result.recognizedWords);
        },
        localeId: languageCode,
      );
    }
  }

  Future<void> stopListening() async {
    await _speechToText.stop();
  }
}
