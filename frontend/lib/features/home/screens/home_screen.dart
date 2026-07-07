import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sarkari_mitra/core/api/api_client.dart';
import 'package:sarkari_mitra/core/localization/app_localizations.dart';
import 'package:sarkari_mitra/core/localization/locale_provider.dart';
import 'package:sarkari_mitra/core/theme/theme_provider.dart';
import 'package:sarkari_mitra/features/chat/screens/chat_screen.dart';
import 'package:sarkari_mitra/core/theme/responsive_layout.dart';
import 'package:sarkari_mitra/features/profile/providers/profile_provider.dart';
import 'package:sarkari_mitra/features/profile/screens/profile_setup_screen.dart';
import 'package:sarkari_mitra/features/profile/screens/profile_view_screen.dart';
import 'package:sarkari_mitra/features/home/screens/category_schemes_screen.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  List<dynamic> _schemes = [];
  bool _isLoadingSchemes = true;

  @override
  void initState() {
    super.initState();
    _fetchSchemes();
  }

  Future<void> _fetchSchemes() async {
    setState(() => _isLoadingSchemes = true);
    try {
      final locale = ref.read(localeProvider);
      final api = ref.read(apiClientProvider);
      final response = await api.get('/schemes?lang=$locale');
      
      List<dynamic> schemes = response?['data'] ?? [];
      
      if (mounted) {
        setState(() {
          _schemes = schemes;
          _isLoadingSchemes = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _isLoadingSchemes = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final profileState = ref.watch(profileProvider);
    final locale = ref.watch(localeProvider);
    final themeMode = ref.watch(themeProvider);
    final isDark = themeMode == ThemeMode.dark;

    ref.listen<ProfileState>(profileProvider, (previous, next) {
      if (!next.isLoading && next.user != null && !next.isComplete) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const ProfileSetupScreen()),
        );
      }
      if (previous?.isComplete == false && next.isComplete) {
        _fetchSchemes();
      }
    });

    ref.listen<String>(localeProvider, (previous, next) {
      if (previous != next) {
        _fetchSchemes();
      }
    });

    if (profileState.isLoading || (!profileState.isComplete && profileState.user != null)) {
      return Scaffold(
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const CircularProgressIndicator(),
              const SizedBox(height: 16),
              Text(AppLocalizations.get(locale, 'loading_recommendations')),
            ],
          ),
        ),
      );
    }

    final userName = profileState.user?['fullName'] ?? 'User';
    final occupation = profileState.profile?['occupation'] ?? 'Citizen';
    final stateStr = profileState.profile?['state'] ?? 'India';

    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: Row(
            children: [
              const Icon(Icons.assured_workload, color: Colors.blue, size: 28),
              const SizedBox(width: 8),
              Text(AppLocalizations.get(locale, 'app_title'), style: const TextStyle(fontWeight: FontWeight.w900)),
            ],
          ),
          actions: [
            IconButton(
              icon: Icon(isDark ? Icons.light_mode : Icons.dark_mode),
              tooltip: 'Toggle Theme',
              onPressed: () => ref.read(themeProvider.notifier).toggleTheme(),
            ),
            PopupMenuButton<String>(
              icon: const Icon(Icons.translate),
              tooltip: 'Change Language',
              onSelected: (lang) => ref.read(localeProvider.notifier).setLocale(lang),
              itemBuilder: (context) => [
                const PopupMenuItem(value: 'en', child: Text('English')),
                const PopupMenuItem(value: 'hi', child: Text('हिंदी (Hindi)')),
              ],
            ),
          ],
          bottom: TabBar(
            tabs: [
              Tab(icon: const Icon(Icons.home), text: AppLocalizations.get(locale, 'home')),
              Tab(icon: const Icon(Icons.grid_view), text: AppLocalizations.get(locale, 'categories')),
              Tab(icon: const Icon(Icons.account_circle), text: AppLocalizations.get(locale, 'profile')),
            ],
            labelColor: Colors.blue.shade700,
            unselectedLabelColor: Colors.grey,
            indicatorColor: Colors.blue.shade700,
          ),
        ),
        body: TabBarView(
          children: [
            _buildHomeFeed(locale, userName, occupation, stateStr),
            _buildCategoriesView(locale),
            const ProfileViewScreen(),
          ],
        ),
        floatingActionButton: FloatingActionButton(
          backgroundColor: Colors.blue.shade700,
          foregroundColor: Colors.white,
          elevation: 4,
          onPressed: () {
            Navigator.push(context, MaterialPageRoute(builder: (_) => const ChatScreen()));
          },
          child: const Icon(Icons.mic, size: 28),
        ),
      ),
    );
  }

  Widget _buildHomeFeed(String locale, String userName, String occupation, String stateStr) {
    return ResponsiveLayout(
      child: RefreshIndicator(
        onRefresh: _fetchSchemes,
        child: ListView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          children: [
            _buildSearchTopBar(context, locale),
            const SizedBox(height: 32),
            _buildWelcomeHeader(locale, userName, occupation, stateStr),
            const SizedBox(height: 32),
            if (_isLoadingSchemes)
              const Center(child: Padding(padding: EdgeInsets.all(32), child: CircularProgressIndicator()))
            else if (_schemes.isEmpty)
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(color: Theme.of(context).cardColor, borderRadius: BorderRadius.circular(16)),
                child: Center(child: Text(AppLocalizations.get(locale, 'no_schemes'), style: const TextStyle(color: Colors.grey))),
              )
            else ...[
              _buildSectionTitle(AppLocalizations.get(locale, 'all_schemes') ?? 'Available Schemes'),
              ..._schemes.map((s) => _buildSchemeCard(s, locale: locale)),
              const SizedBox(height: 80),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildCategoriesView(String locale) {
    final categories = ['Agriculture', 'Education', 'Health', 'Housing', 'Pension', 'Employment'];
    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: 1.5,
      ),
      itemCount: categories.length,
      itemBuilder: (context, index) {
        return Card(
          elevation: 2,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: InkWell(
            borderRadius: BorderRadius.circular(16),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => CategorySchemesScreen(
                    category: categories[index],
                    allSchemes: _schemes,
                  ),
                ),
              );
            },
            child: Center(
              child: Text(categories[index], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            ),
          ),
        );
      },
    );
  }

  Widget _buildSearchTopBar(BuildContext context, String locale) {
    return InkWell(
      onTap: () {
        Navigator.push(context, MaterialPageRoute(builder: (_) => const ChatScreen()));
      },
      borderRadius: BorderRadius.circular(30),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(30),
          border: Border.all(color: Colors.grey.withOpacity(0.3)),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4))],
        ),
        child: Row(
          children: [
            Icon(Icons.auto_awesome, color: Colors.blue.shade600, size: 24),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                AppLocalizations.get(locale, 'ask_anything'),
                style: TextStyle(color: Colors.grey.shade600, fontSize: 16, fontWeight: FontWeight.w500),
              ),
            ),
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(color: Colors.blue.withOpacity(0.1), shape: BoxShape.circle),
              child: Icon(Icons.mic, color: Colors.blue.shade700, size: 20),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildWelcomeHeader(String locale, String userName, String occupation, String stateStr) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '${AppLocalizations.get(locale, 'welcome')} $userName 👋',
          style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900),
        ),
        const SizedBox(height: 8),
        Text(
          '${AppLocalizations.get(locale, 'recommended_schemes')} ${occupation}s ${AppLocalizations.get(locale, 'in')} $stateStr',
          style: TextStyle(fontSize: 16, color: Colors.grey.shade600, fontWeight: FontWeight.w500),
        ),
      ],
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Text(
        title,
        style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildSchemeCard(Map<String, dynamic> scheme, {required String locale}) {
    final category = scheme['categoryName'] ?? scheme['category']?['name'] ?? 'General';
    String deadlineStr = '31 Dec 2026'; // Default fallback
    if (scheme['applicationDeadline'] != null) {
      try {
        deadlineStr = DateTime.parse(scheme['applicationDeadline']).toLocal().toString().substring(0, 10);
      } catch (_) {}
    }
    
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey.withOpacity(0.2)),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(color: Colors.orange.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
                  child: Text(category, style: TextStyle(color: Colors.orange.shade800, fontSize: 12, fontWeight: FontWeight.bold)),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(color: Colors.red.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.event, color: Colors.red.shade600, size: 14),
                      const SizedBox(width: 4),
                      Text('Ends: $deadlineStr', style: TextStyle(color: Colors.red.shade700, fontWeight: FontWeight.bold, fontSize: 12)),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              scheme['title'] ?? '',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, height: 1.3),
            ),
            const SizedBox(height: 8),
            Text(
              scheme['description'] ?? '',
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(color: Colors.grey.shade600, height: 1.4, fontSize: 14),
            ),
            if (scheme['benefits'] != null && scheme['benefits'].toString().isNotEmpty) ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: Colors.green.withOpacity(0.05), borderRadius: BorderRadius.circular(8)),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.stars, color: Colors.green.shade600, size: 16),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        scheme['benefits'],
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(color: Colors.green.shade800, fontSize: 13, fontWeight: FontWeight.w500),
                      ),
                    ),
                  ],
                ),
              ),
            ],
            const SizedBox(height: 16),
            const Divider(height: 1),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                IconButton(
                  icon: const Icon(Icons.bookmark_border, color: Colors.grey),
                  onPressed: () {},
                  tooltip: 'Bookmark',
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue.shade700,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                    elevation: 0,
                  ),
                  onPressed: () {},
                  child: Text(AppLocalizations.get(locale, 'apply_now'), style: const TextStyle(fontWeight: FontWeight.bold)),
                )
              ],
            )
          ],
        ),
      ),
    );
  }
}
