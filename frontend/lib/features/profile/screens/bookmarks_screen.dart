import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/api_client.dart';
import '../../../core/widgets/scheme_card.dart';
import '../../explore/screens/scheme_details_screen.dart';

class BookmarksScreen extends ConsumerStatefulWidget {
  const BookmarksScreen({super.key});
  @override
  ConsumerState<BookmarksScreen> createState() => _BookmarksScreenState();
}

class _BookmarksScreenState extends ConsumerState<BookmarksScreen> {
  bool _isLoading = true;
  List<dynamic> _bookmarks = [];

  @override
  void initState() {
    super.initState();
    _fetchBookmarks();
  }

  Future<void> _fetchBookmarks() async {
    setState(() => _isLoading = true);
    try {
      final api = ref.read(apiClientProvider);
      final response = await api.get('/interactions/favorites');
      if (response['success']) {
        setState(() {
          _bookmarks = response['data'] ?? [];});
  }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to load bookmarks: $e')),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _toggleBookmark(String schemeId) async {
    try {
      final api = ref.read(apiClientProvider);
      final response = await api.post('/interactions/favorite', {'schemeId': schemeId});
      if (response['success']) {
        setState(() {
          _bookmarks.removeWhere((s) => s['id'] == schemeId);
        });
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Scheme removed from bookmarks')),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to update bookmark: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Saved Schemes'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _bookmarks.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.bookmark_border, size: 64, color: Colors.grey.shade400),
                      const SizedBox(height: 16),
                      Text('No saved schemes yet.', style: Theme.of(context).textTheme.titleMedium),
                      const SizedBox(height: 8),
                      const Text('Bookmarks will appear here.'),
                    ],
                  ),
                )
              : ListView.builder(
                  itemCount: _bookmarks.length,
                  itemBuilder: (context, index) {
                    final scheme = _bookmarks[index];
                    return SchemeCard(
                      id: scheme['id'],
                      title: scheme['title'] ?? 'Unknown',
                      shortDescription: scheme['shortDescription'] ?? scheme['description'],
                      category: scheme['categoryName'] ?? (scheme['category'] is Map ? scheme['category']['name'] : scheme['category']) ?? 'General',
                      governmentLevel: scheme['governmentLevel'] ?? 'Central',
                      state: scheme['state'] ?? 'All India',
                      isVerified: scheme['verificationStatus'] == 'VERIFIED',
                      isBookmarked: true,
                      applicationUrl: scheme['applicationUrl'],
                      onBookmark: () => _toggleBookmark(scheme['id']),
                      onDetails: () {
                        Navigator.push(context, MaterialPageRoute(builder: (_) => SchemeDetailsScreen(schemeId: scheme['id'])));
                      },
                    );
                  },
                ),
    );
  }
}
