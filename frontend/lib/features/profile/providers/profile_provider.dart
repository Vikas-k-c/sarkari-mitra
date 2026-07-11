import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sarkari_mitra/core/api/api_client.dart';

class ProfileState {
  final bool isLoading;
  final String? error;
  final Map<String, dynamic>? user;
  final Map<String, dynamic>? profile;
  
  // A profile is complete if the profile object exists and has data.
  bool get isComplete => profile != null && profile!.isNotEmpty;

  ProfileState({this.isLoading = false, this.error, this.user, this.profile});
  ProfileState copyWith({bool? isLoading, String? error, Map<String, dynamic>? user, Map<String, dynamic>? profile, bool clearError = false}) {
    return ProfileState(
      isLoading: isLoading ?? this.isLoading,
      error: clearError ? null : (error ?? this.error),
      user: user ?? this.user,
      profile: profile ?? this.profile,
    );
  }
}

class ProfileNotifier extends StateNotifier<ProfileState> {
  final ApiClient _api;

  ProfileNotifier(this._api) : super(ProfileState(isLoading: true)) {
    fetchProfileData();
  }

  Future<void> fetchProfileData() async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final userRes = await _api.get('/auth/me');
      final user = userRes?['data']?['user'];
      
      Map<String, dynamic>? profile;
      try {
        final profileRes = await _api.get('/profiles');
        profile = profileRes?['data']?['profile'];
      } catch (e) {
        // 404 or missing profile falls here
        profile = null;
      }
      
      state = state.copyWith(isLoading: false, user: user, profile: profile);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<bool> createProfile(Map<String, dynamic> profileData) async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final res = await _api.post('/profiles', profileData);
      state = state.copyWith(
        isLoading: false,
        profile: res?['data']?['profile'] ?? res?['data'],
      );
      return true;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      return false;
    }
  }

  Future<bool> updateProfile(Map<String, dynamic> profileData) async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final res = await _api.patch('/profiles', profileData);
      state = state.copyWith(
        isLoading: false,
        profile: res?['data']?['profile'] ?? res?['data'],
      );
      return true;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      return false;
    }
  }
}

final profileProvider = StateNotifierProvider<ProfileNotifier, ProfileState>((ref) {
  return ProfileNotifier(ref.read(apiClientProvider));});
  