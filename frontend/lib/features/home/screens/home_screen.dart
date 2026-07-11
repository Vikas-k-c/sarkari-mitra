import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sarkari_mitra/core/api/api_client.dart';
import 'package:sarkari_mitra/core/localization/app_localizations.dart';
import 'package:sarkari_mitra/core/localization/locale_provider.dart';
import 'package:sarkari_mitra/core/theme/theme_provider.dart';
import 'package:sarkari_mitra/core/widgets/scheme_card.dart';
import 'package:sarkari_mitra/features/chat/screens/chat_screen.dart';
import 'package:sarkari_mitra/features/explore/screens/explore_schemes_screen.dart';
import 'package:sarkari_mitra/features/explore/screens/scheme_details_screen.dart';
import 'package:sarkari_mitra/features/explore/widgets/scheme_search_delegate.dart';
import 'package:sarkari_mitra/features/profile/providers/profile_provider.dart';
import 'package:sarkari_mitra/features/profile/screens/bookmarks_screen.dart';
import 'package:sarkari_mitra/features/profile/screens/profile_setup_screen.dart';
import 'package:sarkari_mitra/features/profile/screens/profile_view_screen.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});
  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> with AutomaticKeepAliveClientMixin {
  int _currentIndex = 0;
  
  @override
  bool get wantKeepAlive => true;
  
  // Data State
  List<dynamic> _recommended = [];
  List<dynamic> _trending = [];
  List<dynamic> _recent = [];
  List<dynamic> _categories = [];
  Map<String, dynamic>? _metrics;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchAllData();
  }

  Future<void> _fetchAllData() async {
    setState(() => _isLoading = true);
    try {
      final api = ref.read(apiClientProvider);
      
      final results = await Future.wait([
        api.get('/recommendations'),
        api.get('/recommendations/trending'),
        api.get('/schemes?sort=recent'),
        api.get('/schemes/categories'),
        api.get('/schemes/metrics'),
      ]);

      if (mounted) {
        setState(() {
          _recommended = results[0]['data'] ?? [];
          _trending = results[1]['data'] ?? [];
          _recent = (results[2]['data'] ?? []).take(5).toList();
          _categories = results[3]['data'] ?? [];
          _metrics = results[4]['data'];
          _isLoading = false;});
  }
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
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
      
      // Check if profile was updated to refresh recommendations
      if (previous != null && !previous.isLoading && !next.isLoading && next.isComplete) {
        if (previous.profile != next.profile) {
          _fetchAllData();
        }
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

    final pages = [
      _buildHomeContent(locale, profileState.user?['fullName'] ?? 'User'),
      const ExploreSchemesScreen(),
      const BookmarksScreen(),
      const ProfileViewScreen(),
    ];

    return Scaffold(
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
            onPressed: () => ref.read(themeProvider.notifier).toggleTheme(),
          ),
          PopupMenuButton<String>(
            icon: const Icon(Icons.translate),
            onSelected: (lang) => ref.read(localeProvider.notifier).setLocale(lang),
            itemBuilder: (context) => [
              const PopupMenuItem(value: 'en', child: Text('English')),
              const PopupMenuItem(value: 'hi', child: Text('हिंदी')),
            ],
          ),
        ],
      ),
      body: pages[_currentIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (idx) => setState(() => _currentIndex = idx),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.search), label: 'Explore'),
          NavigationDestination(icon: Icon(Icons.bookmark), label: 'Saved'),
          NavigationDestination(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
      floatingActionButton: _currentIndex == 0 ? FloatingActionButton.extended(
        onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ChatScreen())),
        icon: const Icon(Icons.mic),
        label: const Text('Ask AI'),
      ) : null,
    );
  }

  Widget _buildHomeContent(String locale, String userName) {
    super.build(context);
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }
    return RefreshIndicator(
      onRefresh: _fetchAllData,
      child: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        children: [
          // 1. Greeting
          Text('Welcome, $userName 👋', style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold)),
          const SizedBox(height: 24),
          
          // 2. Search Schemes
          _buildSearchBox(),
          const SizedBox(height: 24),

          // 3. Ask AI
          _buildAIBanner(),
          const SizedBox(height: 32),

          // 4. Recommended
          if (_recommended.isNotEmpty) ...[
            _buildSectionTitle('Recommended For You'),
            ..._recommended.take(5).map((s) => _buildSchemeCard(s, showMatch: true)),
            const SizedBox(height: 32),
          ],

          // 5. Quick Actions
          _buildSectionTitle('Quick Actions'),
          _buildQuickActions(),
          const SizedBox(height: 32),

          // 6. Trending
          if (_trending.isNotEmpty) ...[
            _buildSectionTitle('Trending Schemes'),
            ..._trending.take(3).map((s) => _buildSchemeCard(s)),
            const SizedBox(height: 32),
          ],

          // 7. Recently Added
          if (_recent.isNotEmpty) ...[
            _buildSectionTitle('Recently Added'),
            ..._recent.map((s) => _buildSchemeCard(s)),
            const SizedBox(height: 32),
          ],

          // 8. Explore All
          Center(
            child: ElevatedButton.icon(
              onPressed: () => setState(() => _currentIndex = 1),
              icon: const Icon(Icons.explore),
              label: const Text('Explore All Schemes'),
            ),
          ),
          const SizedBox(height: 32),

          // 9. Categories
          if (_categories.isNotEmpty) ...[
            _buildSectionTitle('Browse by Category'),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _categories.map((c) => ActionChip(
                label: Text(c['name']),
                onPressed: () {
                  Navigator.push(context, MaterialPageRoute(
                    builder: (_) => ExploreSchemesScreen(initialCategoryName: c['name']),
                  ));
                },
              )).toList(),
            ),
            const SizedBox(height: 32),
          ],

          // 10. Dashboard Footer
          if (_metrics != null) _buildFooter(),
        ],
      ),
    );
  }

  Widget _buildSearchBox() {
    return InkWell(
      onTap: () {
        showSearch(
          context: context,
          delegate: SchemeSearchDelegate(ref),
        );
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            const Icon(Icons.search, color: Colors.grey),
            const SizedBox(width: 8),
            Text('Search for schemes...', style: TextStyle(color: Colors.grey.shade600)),
          ],
        ),
      ),
    );
  }

  Widget _buildAIBanner() {
    return InkWell(
      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ChatScreen())),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: LinearGradient(colors: [Colors.blue.shade700, Colors.purple.shade700]),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          children: [
            const Icon(Icons.auto_awesome, color: Colors.white, size: 32),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Ask Sarkari Mitra', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
                  const SizedBox(height: 4),
                  Text('Find schemes using AI chat in your language.', style: TextStyle(color: Colors.white.withValues(alpha: 0.9))),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActions() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        _buildActionItem(Icons.school, 'Education', Colors.orange),
        _buildActionItem(Icons.health_and_safety, 'Health', Colors.green),
        _buildActionItem(Icons.business, 'Business', Colors.blue),
        _buildActionItem(Icons.more_horiz, 'More', Colors.purple),
      ],
    );
  }

  Widget _buildActionItem(IconData icon, String label, Color color) {
    return InkWell(
      onTap: () {
        Navigator.push(context, MaterialPageRoute(
          builder: (_) => ExploreSchemesScreen(initialCategoryName: label),
        ));
      },
      borderRadius: BorderRadius.circular(16),
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          children: [
            CircleAvatar(
              backgroundColor: color.withValues(alpha: 0.1),
              radius: 28,
              child: Icon(icon, color: color, size: 28),
            ),
            const SizedBox(height: 8),
            Text(label, style: const TextStyle(fontWeight: FontWeight.w500)),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Text(title, style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
    );
  }

  Widget _buildSchemeCard(dynamic scheme, {bool showMatch = false}) {
    return SchemeCard(
      id: scheme['id'],
      title: scheme['title'] ?? 'Unknown',
      shortDescription: scheme['shortDescription'] ?? scheme['description'],
      category: scheme['categoryName'] ?? (scheme['category'] is Map ? scheme['category']['name'] : scheme['category']) ?? 'General',
      governmentLevel: scheme['governmentLevel'] ?? 'Central',
      state: scheme['state'] ?? 'All India',
      isVerified: scheme['verificationStatus'] == 'VERIFIED' || scheme['isVerified'] == true,
      applicationUrl: scheme['applicationUrl'],
      recommendationScore: showMatch ? scheme['score'] : null,
      recommendationExplanation: showMatch && scheme['explanations'] != null 
          ? (scheme['explanations'] as List).first 
          : null,
      onDetails: () {
        Navigator.push(context, MaterialPageRoute(builder: (_) => SchemeDetailsScreen(
          schemeId: scheme['id'],
          recommendationScore: showMatch ? scheme['score'] : null,
          recommendationExplanation: showMatch && scheme['explanations'] != null 
              ? (scheme['explanations'] as List).first 
              : null,
        )));
      },
    );
  }

  Widget _buildFooter() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(color: Theme.of(context).colorScheme.surfaceContainerHighest, borderRadius: BorderRadius.circular(16)),
      child: Column(
        children: [
          const Text('Government Knowledge Base', style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text('${_metrics!['total'] ?? 0} Verified Schemes Active'),
          const SizedBox(height: 16),
          const Text('Sarkari Mitra v1.0', style: TextStyle(color: Colors.grey, fontSize: 12)),
        ],
      ),
    );
  }
}
