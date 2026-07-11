import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/api_client.dart';
import '../../../core/localization/locale_provider.dart';
import '../../../core/widgets/scheme_card.dart';
import '../widgets/filter_bottom_sheet.dart';
import 'scheme_details_screen.dart';

final exploreCacheProvider = StateProvider<Map<String, List<dynamic>>>((ref) => {});
final explorePageCacheProvider = StateProvider<Map<String, int>>((ref) => {});

class ExploreSchemesScreen extends ConsumerStatefulWidget {
  final String? initialCategoryName;
  const ExploreSchemesScreen({super.key, this.initialCategoryName});
  @override
  ConsumerState<ExploreSchemesScreen> createState() => _ExploreSchemesScreenState();
}

class _ExploreSchemesScreenState extends ConsumerState<ExploreSchemesScreen> {
  bool _isLoading = true;
  bool _isLoadingMore = false;
  bool _hasMore = true;
  int _page = 1;
  final int _limit = 10;
  List<dynamic> _schemes = [];
  Map<String, String?> _filters = {};
  Set<String> _bookmarkedIds = {};
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    if (widget.initialCategoryName != null) {
      _filters['categoryName'] = widget.initialCategoryName;
    }
    _scrollController.addListener(_onScroll);
    
    // Initial fetch in next tick
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadInitialData();
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent * 0.8) {
      if (!_isLoadingMore && _hasMore && !_isLoading) {
        _fetchMore();
      }
    }
  }

  String get _cacheKey {
    return _filters.entries
        .where((e) => e.value != null)
        .map((e) => '${e.key}=${e.value}')
        .join('&');
  }

  Future<void> _loadInitialData() async {
    _fetchBookmarks(); // fetch bookmarks independently
    final cache = ref.read(exploreCacheProvider);
    final pageCache = ref.read(explorePageCacheProvider);

    if (cache.containsKey(_cacheKey)) {
      setState(() {
        _schemes = List.from(cache[_cacheKey]!);
        _page = pageCache[_cacheKey] ?? 1;
        _isLoading = false;
        _hasMore = _schemes.length >= (_page * _limit);
      });
    } else {
      await _fetchSchemes(isRefresh: true);
    }
  }

  Future<void> _fetchBookmarks() async {
    try {
      final api = ref.read(apiClientProvider);
      final response = await api.get('/interactions/favorites');
      if (response['success'] && mounted) {
        final List bookmarks = response['data'] ?? [];
        setState(() {
          _bookmarkedIds = bookmarks.map((b) => b['id'].toString()).toSet();
        });
      }
    } catch (_) {}
  }

  Future<void> _toggleBookmark(String schemeId) async {
    final isBookmarked = _bookmarkedIds.contains(schemeId);
    setState(() {
      if (isBookmarked) {
        _bookmarkedIds.remove(schemeId);
      } else {
        _bookmarkedIds.add(schemeId);
      }
    });
    try {
      final api = ref.read(apiClientProvider);
      await api.post('/interactions/favorite', {'schemeId': schemeId});
    } catch (_) {
      // Revert on failure
      if (mounted) {
        setState(() {
          if (isBookmarked) {
            _bookmarkedIds.add(schemeId);
          } else {
            _bookmarkedIds.remove(schemeId);
          }
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to update bookmark')),
        );
      }
    }
  }

  Future<void> _fetchSchemes({bool isRefresh = false}) async {
    if (isRefresh) {
      setState(() {
        _isLoading = true;
        _page = 1;
        _hasMore = true;
      });
    } else {
      if (_isLoadingMore || !_hasMore) return;
      setState(() => _isLoadingMore = true);
      _page++;
    }

    try {
      final api = ref.read(apiClientProvider);
      final locale = ref.read(localeProvider);
      
      String url = '/schemes?lang=$locale&page=$_page&limit=$_limit';
      if (_filters['categoryId'] != null) url += '&categoryId=${_filters['categoryId']}';
      if (_filters['categoryName'] != null) url += '&categoryName=${_filters['categoryName']}';
      if (_filters['governmentLevel'] != null) url += '&governmentLevel=${_filters['governmentLevel']}';
      if (_filters['state'] != null) url += '&state=${_filters['state']}';
      if (_filters['ministry'] != null) url += '&ministry=${_filters['ministry']}';
      
      final response = await api.get(url);
      if (response['success']) {
        final List<dynamic> newData = response['data'] ?? [];
        if (mounted) {
          setState(() {
            if (isRefresh) {
              _schemes = newData;
            } else {
              _schemes.addAll(newData);
            }
            _hasMore = newData.length == _limit;
          });
          
          // update cache
          final cache = ref.read(exploreCacheProvider.notifier);
          final pageCache = ref.read(explorePageCacheProvider.notifier);
          final currentCache = Map<String, List<dynamic>>.from(cache.state);
          final currentPageCache = Map<String, int>.from(pageCache.state);
          currentCache[_cacheKey] = List.from(_schemes);
          currentPageCache[_cacheKey] = _page;
          cache.state = currentCache;
          pageCache.state = currentPageCache;
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to fetch schemes: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
          _isLoadingMore = false;
        });
      }
    }
  }

  void _fetchMore() {
    _fetchSchemes();
  }

  void _openFilterSheet() async {
    final filters = await showModalBottomSheet<Map<String, String?>>(
      context: context,
      isScrollControlled: true,
      builder: (context) => FilterBottomSheet(initialFilters: _filters),
    );

    if (filters != null) {
      setState(() => _filters = filters);
      _fetchSchemes(isRefresh: true);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Explore All Schemes'),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: _openFilterSheet,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _schemes.isEmpty
              ? const Center(child: Text('No schemes found matching the criteria.'))
              : RefreshIndicator(
                  onRefresh: () => _fetchSchemes(isRefresh: true),
                  child: ListView.builder(
                    controller: _scrollController,
                    physics: const AlwaysScrollableScrollPhysics(),
                    itemCount: _schemes.length + (_hasMore ? 1 : 0),
                    itemBuilder: (context, index) {
                      if (index == _schemes.length) {
                        return const Padding(
                          padding: EdgeInsets.all(16.0),
                          child: Center(child: CircularProgressIndicator()),
                        );
                      }
                      
                      final scheme = _schemes[index];
                      final isBookmarked = _bookmarkedIds.contains(scheme['id'].toString());

                      return SchemeCard(
                        id: scheme['id'].toString(),
                        title: scheme['title'] ?? 'Unknown',
                        shortDescription: scheme['shortDescription'] ?? scheme['description'],
                        category: scheme['categoryName'] ?? (scheme['category'] is Map ? scheme['category']['name'] : scheme['category']) ?? 'General',
                        governmentLevel: scheme['governmentLevel'] ?? 'Central',
                        state: scheme['state'] ?? 'All India',
                        isVerified: scheme['verificationStatus'] == 'VERIFIED',
                        isBookmarked: isBookmarked,
                        applicationUrl: scheme['applicationUrl'],
                        onBookmark: () => _toggleBookmark(scheme['id'].toString()),
                        onDetails: () {
                          Navigator.push(context, MaterialPageRoute(builder: (_) => SchemeDetailsScreen(schemeId: scheme['id'].toString())));
                        },
                      );
                    },
                  ),
                ),
    );
  }
}
