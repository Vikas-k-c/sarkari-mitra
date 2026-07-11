import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sarkari_mitra/core/api/api_client.dart';
import 'package:url_launcher/url_launcher.dart';

class SchemeDetailsScreen extends ConsumerStatefulWidget {
  final String schemeId;
  final int? recommendationScore;
  final String? recommendationExplanation;

  const SchemeDetailsScreen({super.key,
    required this.schemeId,
    this.recommendationScore,
    this.recommendationExplanation,});
  @override
  ConsumerState<SchemeDetailsScreen> createState() => _SchemeDetailsScreenState();
}

class _SchemeDetailsScreenState extends ConsumerState<SchemeDetailsScreen> {
  bool _isLoading = true;
  Map<String, dynamic>? _scheme;
  bool _isBookmarked = false; // We could fetch this or pass it in

  @override
  void initState() {
    super.initState();
    _fetchSchemeDetails();
    _logView();
  }

  Future<void> _fetchSchemeDetails() async {
    try {
      final api = ref.read(apiClientProvider);
      final response = await api.get('/schemes/${widget.schemeId}');
      if (response['success']) {
        setState(() {
          _scheme = response['data'];});
  }
    } catch (e) {
      // Handle error
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _logView() async {
    try {
      final api = ref.read(apiClientProvider);
      await api.post('/recommendations/interact', {
        'schemeId': widget.schemeId,
        'type': 'VIEW',});
  } catch (e) {
      // ignore
    }
  }

  Future<void> _toggleBookmark() async {
    setState(() => _isBookmarked = !_isBookmarked);
    try {
      final api = ref.read(apiClientProvider);
      await api.post('/recommendations/interact', {
        'schemeId': widget.schemeId,
        'type': 'FAVORITE',});
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Scheme saved to bookmarks')),
      );
    } catch (e) {
      setState(() => _isBookmarked = !_isBookmarked);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (_scheme == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Error')),
        body: const Center(child: Text('Scheme not found')),
      );
    }

    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(_scheme!['title'] ?? 'Scheme Details'),
        actions: [
          IconButton(
            icon: Icon(_isBookmarked ? Icons.bookmark : Icons.bookmark_border),
            color: _isBookmarked ? theme.colorScheme.primary : null,
            onPressed: _toggleBookmark,
          ),
          IconButton(
            icon: const Icon(Icons.share),
            onPressed: () {
              // Share functionality
            },
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Title and Badges
            Text(
              _scheme!['title'] ?? '',
              style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 4,
              children: [
                Chip(
                  label: Text(_scheme!['category']?['name'] ?? 'General'),
                  backgroundColor: theme.colorScheme.secondaryContainer,
                ),
                Chip(
                  label: Text(_scheme!['governmentLevel'] ?? 'Central'),
                  backgroundColor: theme.colorScheme.tertiaryContainer,
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Recommendation Card
            if (widget.recommendationScore != null) ...[
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: theme.colorScheme.primaryContainer.withValues(alpha: 0.4),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: theme.colorScheme.primary.withValues(alpha: 0.2)),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.star, color: Colors.orange.shade400, size: 28),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '${widget.recommendationScore}% Match for your profile',
                            style: theme.textTheme.titleMedium?.copyWith(
                              color: theme.colorScheme.primary,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            widget.recommendationExplanation ?? 'This scheme matches your profile details.',
                            style: theme.textTheme.bodyMedium,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
            ],

            // Description
            _buildSectionHeader(context, 'About the Scheme', Icons.info_outline),
            Text(_scheme!['description'] ?? '', style: theme.textTheme.bodyLarge),
            const SizedBox(height: 24),

            // Benefits
            if (_scheme!['benefits'] != null) ...[
              _buildSectionHeader(context, 'Benefits', Icons.card_giftcard),
              Text(_scheme!['benefits'] ?? '', style: theme.textTheme.bodyLarge),
              const SizedBox(height: 24),
            ],

            // Eligibility Criteria
            if (_scheme!['eligibility'] != null && (_scheme!['eligibility'] as List).isNotEmpty) ...[
              _buildSectionHeader(context, 'Eligibility Criteria', Icons.check_circle_outline),
              ...(_scheme!['eligibility'] as List).map((rule) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 8.0),
                  child: Row(
                    children: [
                      const Icon(Icons.check, color: Colors.green, size: 20),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          '${rule['attribute']} ${rule['operator']} ${rule['value']}',
                          style: theme.textTheme.bodyMedium,
                        ),
                      ),
                    ],
                  ),
                );
              }),
              const SizedBox(height: 24),
            ],

            // FAQ (If any)
            if (_scheme!['faq'] != null) ...[
              _buildSectionHeader(context, 'Frequently Asked Questions', Icons.help_outline),
              // Render FAQ json
              const SizedBox(height: 24),
            ],
          ],
        ),
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              minimumSize: const Size(double.infinity, 50),
            ),
            onPressed: () async {
              // Log Application
              try {
                final api = ref.read(apiClientProvider);
                await api.post('/recommendations/interact', {
                  'schemeId': widget.schemeId,
                  'type': 'APPLY',});
  } catch (_) {}

              final url = _scheme!['applicationUrl'];
              if (url != null && await canLaunchUrl(Uri.parse(url))) {
                await launchUrl(Uri.parse(url));
              }
            },
            child: const Text('Apply Now', style: TextStyle(fontSize: 18)),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(BuildContext context, String title, IconData icon) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Row(
        children: [
          Icon(icon, color: Theme.of(context).colorScheme.primary),
          const SizedBox(width: 8),
          Text(
            title,
            style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}
