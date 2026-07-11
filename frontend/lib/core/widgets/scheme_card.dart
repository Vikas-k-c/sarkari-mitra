import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class SchemeCard extends StatelessWidget {
  final String id;
  final String title;
  final String? shortDescription;
  final String category;
  final String governmentLevel;
  final String state;
  final bool isVerified;
  final int? recommendationScore;
  final String? recommendationExplanation;
  final String? applicationUrl;
  final VoidCallback? onApply;
  final VoidCallback onDetails;
  final VoidCallback? onBookmark;
  final bool isBookmarked;

  const SchemeCard({super.key,
    required this.id,
    required this.title,
    this.shortDescription,
    required this.category,
    required this.governmentLevel,
    required this.state,
    this.isVerified = true,
    this.recommendationScore,
    this.recommendationExplanation,
    this.applicationUrl,
    this.onApply,
    required this.onDetails,
    this.onBookmark,
    this.isBookmarked = false,});
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onDetails,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header row
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Text(
                      title,
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  if (onBookmark != null)
                    IconButton(
                      icon: Icon(
                        isBookmarked ? Icons.bookmark : Icons.bookmark_border,
                        color: isBookmarked ? theme.colorScheme.primary : null,
                      ),
                      onPressed: onBookmark,
                    ),
                ],
              ),
              const SizedBox(height: 8),

              // Badges
              Wrap(
                spacing: 8,
                runSpacing: 4,
                children: [
                  _buildBadge(context, category, theme.colorScheme.secondary),
                  _buildBadge(context, governmentLevel, Colors.deepPurple),
                  if (state != 'All India') _buildBadge(context, state, Colors.teal),
                  if (isVerified)
                    _buildBadge(
                      context,
                      'Verified',
                      Colors.green,
                      icon: Icons.verified,
                    ),
                ],
              ),
              const SizedBox(height: 12),

              // Description
              if (shortDescription != null) ...[
                Text(
                  shortDescription!,
                  style: theme.textTheme.bodyMedium,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 12),
              ],

              // Recommendation section
              if (recommendationScore != null && recommendationExplanation != null) ...[
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primaryContainer.withValues(alpha: 0.3),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: theme.colorScheme.primaryContainer),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.star, color: Colors.orange.shade400, size: 20),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '$recommendationScore% Match',
                              style: theme.textTheme.labelLarge?.copyWith(
                                color: theme.colorScheme.primary,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              recommendationExplanation!,
                              style: theme.textTheme.bodySmall,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
              ],

              // Actions
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: onDetails,
                    child: const Text('Details'),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: (applicationUrl != null && applicationUrl!.isNotEmpty) || onApply != null
                        ? () async {
                            if (onApply != null) {
                              onApply!();
                            } else if (applicationUrl != null && applicationUrl!.isNotEmpty) {
                              final url = Uri.parse(applicationUrl!);
                              if (await canLaunchUrl(url)) {
                                await launchUrl(url);
                              }
                            }
                          }
                        : null,
                    child: Text((applicationUrl == null || applicationUrl!.isEmpty) && onApply == null ? 'Application Unavailable' : 'Apply'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBadge(BuildContext context, String label, Color color, {IconData? icon}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(4),
        border: Border.all(color: color.withValues(alpha: 0.5)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 12, color: color),
            const SizedBox(width: 4),
          ],
          Text(
            label,
            style: Theme.of(context).textTheme.labelSmall?.copyWith(
                  color: color,
                  fontWeight: FontWeight.w600,
                ),
          ),
        ],
      ),
    );
  }
}
