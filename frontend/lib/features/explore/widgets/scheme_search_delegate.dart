import 'dart:async';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/api_client.dart';
import '../../../core/widgets/scheme_card.dart';

class SchemeSearchDelegate extends SearchDelegate {
  final WidgetRef ref;
  List<String> recentSearches = [];

  SchemeSearchDelegate(this.ref) {
    _loadRecentSearches();
  }

  Future<void> _loadRecentSearches() async {
    final prefs = await SharedPreferences.getInstance();
    recentSearches = prefs.getStringList('recent_searches') ?? [];
  }

  Future<void> _addRecentSearch(String query) async {
    if (query.trim().isEmpty) return;
    final prefs = await SharedPreferences.getInstance();
    recentSearches.remove(query);
    recentSearches.insert(0, query);
    if (recentSearches.length > 5) {
      recentSearches = recentSearches.sublist(0, 5);
    }
    await prefs.setStringList('recent_searches', recentSearches);
  }

  Future<void> _clearRecentSearches() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('recent_searches');
    recentSearches.clear();
  }

  void _recordSearchInteraction(String schemeId) {
    ref.read(apiClientProvider).post('/interactions', {
      'schemeId': schemeId,
      'interactionType': 'SEARCH_CLICK'
    }).catchError((_) {});
  }

  @override
  List<Widget>? buildActions(BuildContext context) {
    return [
      if (query.isNotEmpty)
        IconButton(
          icon: const Icon(Icons.clear),
          onPressed: () => query = '',
        ),
    ];
  }

  @override
  Widget? buildLeading(BuildContext context) {
    return IconButton(
      icon: const Icon(Icons.arrow_back),
      onPressed: () => close(context, null),
    );
  }

  @override
  Widget buildResults(BuildContext context) {
    if (query.trim().isEmpty) {
      return const Center(child: Text('Enter a search term'));
    }

    _addRecentSearch(query);
    return SearchResultsView(query: query, ref: ref, delegate: this);
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    return SearchSuggestionsView(
      query: query, 
      ref: ref, 
      recentSearches: recentSearches,
      onClearRecent: () async {
        await _clearRecentSearches();
        query = ''; // trigger rebuild
      },
      onSuggestionTap: (String suggestion) {
        query = suggestion;
        showResults(context);
      },
      delegate: this
    );
  }
}

class SearchSuggestionsView extends StatefulWidget {
  final String query;
  final WidgetRef ref;
  final List<String> recentSearches;
  final VoidCallback onClearRecent;
  final Function(String) onSuggestionTap;
  final SchemeSearchDelegate delegate;

  const SearchSuggestionsView({
    Key? key, 
    required this.query, 
    required this.ref,
    required this.recentSearches,
    required this.onClearRecent,
    required this.onSuggestionTap,
    required this.delegate,
  }) : super(key: key);

  @override
  _SearchSuggestionsViewState createState() => _SearchSuggestionsViewState();
}

class _SearchSuggestionsViewState extends State<SearchSuggestionsView> {
  Timer? _debounce;
  List<dynamic> _autocompleteResults = [];
  bool _isLoading = false;
  int _currentRequest = 0;

  @override
  void initState() {
    super.initState();
    _fetchAutocomplete();
  }

  @override
  void didUpdateWidget(SearchSuggestionsView oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.query != widget.query) {
      _fetchAutocomplete();
    }
  }

  void _fetchAutocomplete() {
    if (widget.query.trim().isEmpty) {
      setState(() {
        _autocompleteResults = [];
        _isLoading = false;
      });
      return;
    }

    if (_debounce?.isActive ?? false) _debounce!.cancel();
    
    setState(() => _isLoading = true);
    
    _debounce = Timer(const Duration(milliseconds: 300), () async {
      _currentRequest++;
      final requestId = _currentRequest;
      
      try {
        final res = await widget.ref.read(apiClientProvider).get('/search?q=${widget.query}&mode=autocomplete');
        if (requestId == _currentRequest && mounted) {
          setState(() {
            _autocompleteResults = (res['data'] as List<dynamic>?) ?? [];
            _isLoading = false;
          });
        }
      } catch (e) {
        if (requestId == _currentRequest && mounted) {
          setState(() => _isLoading = false);
        }
      }
    });
  }

  @override
  void dispose() {
    _debounce?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.query.isEmpty) {
      // Empty State: Recent Searches
      return Column(
        children: [
          if (widget.recentSearches.isNotEmpty)
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Recent Searches', style: TextStyle(fontWeight: FontWeight.bold)),
                  TextButton(
                    onPressed: widget.onClearRecent,
                    child: const Text('Clear'),
                  ),
                ],
              ),
            ),
          Expanded(
            child: ListView.builder(
              itemCount: widget.recentSearches.length,
              itemBuilder: (context, index) {
                return ListTile(
                  leading: const Icon(Icons.history),
                  title: Text(widget.recentSearches[index]),
                  onTap: () => widget.onSuggestionTap(widget.recentSearches[index]),
                );
              },
            ),
          ),
        ],
      );
    }

    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    return ListView.builder(
      itemCount: _autocompleteResults.length,
      itemBuilder: (context, index) {
        final title = _autocompleteResults[index]['title'] as String;
        return ListTile(
          leading: const Icon(Icons.search),
          title: _HighlightText(text: title, query: widget.query),
          onTap: () {
            widget.onSuggestionTap(title);
          },
        );
      },
    );
  }
}

class SearchResultsView extends StatefulWidget {
  final String query;
  final WidgetRef ref;
  final SchemeSearchDelegate delegate;

  const SearchResultsView({Key? key, required this.query, required this.ref, required this.delegate}) : super(key: key);

  @override
  _SearchResultsViewState createState() => _SearchResultsViewState();
}

class _SearchResultsViewState extends State<SearchResultsView> {
  bool _isLoading = true;
  List<dynamic> _results = [];
  String? _didYouMean;
  List<dynamic> _trending = [];
  int _currentRequest = 0;

  @override
  void initState() {
    super.initState();
    _fetchResults();
  }

  @override
  void didUpdateWidget(SearchResultsView oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.query != widget.query) {
      _fetchResults();
    }
  }

  Future<void> _fetchResults() async {
    setState(() => _isLoading = true);
    _currentRequest++;
    final requestId = _currentRequest;

    try {
      final res = await widget.ref.read(apiClientProvider).get('/search?q=${widget.query}&mode=full');
      if (requestId == _currentRequest && mounted) {
        final results = res['data'] as List<dynamic>? ?? [];
        final didYouMean = res['didYouMean'] as String?;
        
        setState(() {
          _results = results;
          _didYouMean = didYouMean;
          _isLoading = false;
        });

        if (results.isEmpty) {
          _fetchTrendingFallback(requestId);
        }
      }
    } catch (e) {
      if (requestId == _currentRequest && mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _fetchTrendingFallback(int requestId) async {
    try {
      final res = await widget.ref.read(apiClientProvider).get('/interactions/trending');
      if (requestId == _currentRequest && mounted) {
        setState(() {
          _trending = res['data'] as List<dynamic>? ?? [];
        });
      }
    } catch (e) {}
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_results.isEmpty) {
      // Empty state
      return SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (_didYouMean != null) ...[
                Text('Did you mean?', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 8),
                ListTile(
                  title: Text(_didYouMean!, style: const TextStyle(color: Colors.blue, fontStyle: FontStyle.italic)),
                  onTap: () {
                    widget.delegate.query = _didYouMean!;
                    widget.delegate.showResults(context);
                  },
                ),
                const Divider(),
              ],
              const SizedBox(height: 16),
              Text('Trending Schemes', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              if (_trending.isEmpty) const CircularProgressIndicator(),
              ..._trending.map((scheme) => ListTile(
                title: Text(scheme['title'] ?? 'Unknown'),
                subtitle: Text(scheme['categoryName'] ?? 'General'),
                onTap: () {
                  widget.delegate._recordSearchInteraction(scheme['id']);
                  // Navigate to details
                },
              )).toList()
            ],
          ),
        ),
      );
    }

    return ListView.builder(
      itemCount: _results.length,
      itemBuilder: (context, index) {
        final scheme = _results[index];
        return SchemeCard(
          id: scheme['id'],
          title: scheme['title'] ?? 'Unknown',
          shortDescription: scheme['shortDescription'] ?? scheme['description'],
          category: scheme['categoryName'] ?? 'General',
          governmentLevel: scheme['governmentLevel'] ?? 'Central',
          state: scheme['state'] ?? 'All India',
          isVerified: scheme['verificationStatus'] == 'VERIFIED',
          onApply: () {},
          onDetails: () {
            widget.delegate._recordSearchInteraction(scheme['id']);
          },
        );
      },
    );
  }
}

class _HighlightText extends StatelessWidget {
  final String text;
  final String query;

  const _HighlightText({Key? key, required this.text, required this.query}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (query.isEmpty) return Text(text);

    final String lowerText = text.toLowerCase();
    final String lowerQuery = query.toLowerCase();
    final int matchIndex = lowerText.indexOf(lowerQuery);

    if (matchIndex < 0) return Text(text);

    return RichText(
      text: TextSpan(
        style: DefaultTextStyle.of(context).style,
        children: [
          TextSpan(text: text.substring(0, matchIndex)),
          TextSpan(
            text: text.substring(matchIndex, matchIndex + query.length),
            style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.blue),
          ),
          TextSpan(text: text.substring(matchIndex + query.length)),
        ],
      ),
    );
  }
}
