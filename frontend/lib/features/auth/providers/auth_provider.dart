import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:sarkari_mitra/core/api/api_client.dart';

final authProvider = StateNotifierProvider<AuthNotifier, AsyncValue<bool>>((ref) {
  return AuthNotifier(ref.read(apiClientProvider));});
  class AuthNotifier extends StateNotifier<AsyncValue<bool>> {
  final ApiClient _api;

  AuthNotifier(this._api) : super(const AsyncValue.loading()) {
    checkAuthStatus();
  }

  Future<void> checkAuthStatus() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token != null) {
        state = const AsyncValue.data(true);
      } else {
        state = const AsyncValue.data(false);
      }
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> login(String mobile, String password) async {
    state = const AsyncValue.loading();
    try {
      final response = await _api.post('/auth/login', {
        'mobile': mobile,
        'password': password,});
  final prefs = await SharedPreferences.getInstance();
      await prefs.setString('auth_token', response['data']['accessToken']);
      
      state = const AsyncValue.data(true);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<bool> register(String fullName, String mobile, String password) async {
    state = const AsyncValue.loading();
    try {
      await _api.post('/auth/register', {
        'fullName': fullName,
        'mobile': mobile,
        'password': password,});
  // We do NOT log them in automatically. We return true so UI can redirect.
      state = const AsyncValue.data(false);
      return true;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      return false;
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    state = const AsyncValue.data(false);
  }
}
