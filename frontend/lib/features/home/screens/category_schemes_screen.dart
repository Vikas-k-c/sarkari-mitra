import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sarkari_mitra/core/localization/app_localizations.dart';
import 'package:sarkari_mitra/core/localization/locale_provider.dart';
import 'package:sarkari_mitra/core/theme/responsive_layout.dart';

class CategorySchemesScreen extends ConsumerWidget {
  final String category;
  final List<dynamic> allSchemes;

  const CategorySchemesScreen({
    super.key,
    required this.category,
    required this.allSchemes,});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final locale = ref.watch(localeProvider);
    final filteredSchemes = allSchemes.where((s) {
      final schemeCategory = s['categoryName'] ?? s['category']?['name'] ?? 'General';
      return schemeCategory.toString().toLowerCase() == category.toLowerCase();
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: Text(category, style: const TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: ResponsiveLayout(
        child: filteredSchemes.isEmpty
            ? Center(
                child: Text(
                  AppLocalizations.get(locale, 'no_schemes'),
                  style: const TextStyle(color: Colors.grey, fontSize: 16),
                ),
              )
            : ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                itemCount: filteredSchemes.length,
                itemBuilder: (context, index) {
                  return _buildSchemeCard(context, filteredSchemes[index], locale);
                },
              ),
      ),
    );
  }

  Widget _buildSchemeCard(BuildContext context, Map<String, dynamic> scheme, String locale) {
    final cat = scheme['categoryName'] ?? (scheme['category'] is Map ? scheme['category']['name'] : scheme['category']) ?? 'General';
    String deadlineStr = '31 Dec 2026';
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
        border: Border.all(color: Colors.grey.withValues(alpha: 0.2)),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 10, offset: const Offset(0, 4))],
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
                  decoration: BoxDecoration(color: Colors.orange.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
                  child: Text(cat, style: TextStyle(color: Colors.orange.shade800, fontSize: 12, fontWeight: FontWeight.bold)),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(color: Colors.red.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
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
                decoration: BoxDecoration(color: Colors.green.withValues(alpha: 0.05), borderRadius: BorderRadius.circular(8)),
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
