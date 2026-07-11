import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/api_client.dart';

class FilterBottomSheet extends ConsumerStatefulWidget {
  final Map<String, String?> initialFilters;

  const FilterBottomSheet({super.key, required this.initialFilters});
  @override
  ConsumerState<FilterBottomSheet> createState() => _FilterBottomSheetState();
}

class _FilterBottomSheetState extends ConsumerState<FilterBottomSheet> {
  late Map<String, String?> _filters;
  List<dynamic> _categories = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _filters = Map.from(widget.initialFilters);
    _fetchCategories();
  }

  Future<void> _fetchCategories() async {
    try {
      final api = ref.read(apiClientProvider);
      final response = await api.get('/schemes/categories');
      if (response['success']) {
        setState(() {
          _categories = response['data'] ?? [];});
  }
    } catch (e) {
      // ignore
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: 16,
        right: 16,
        top: 16,
        bottom: MediaQuery.of(context).viewInsets.bottom + 16,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Filter Schemes', style: Theme.of(context).textTheme.titleLarge),
              TextButton(
                onPressed: () {
                  setState(() {
                    _filters.clear();});
  },
                child: const Text('Clear All'),
              ),
            ],
          ),
          const Divider(),
          const SizedBox(height: 8),

          // Category
          const Text('Category', style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          _isLoading
              ? const CircularProgressIndicator()
              : DropdownButtonFormField<String>(
                  decoration: const InputDecoration(labelText: 'Select Category'),
                  initialValue: _filters['categoryId'],
                  items: [
                    const DropdownMenuItem(value: null, child: Text('All Categories')),
                    ..._categories.map((c) => DropdownMenuItem(
                          value: c['id'].toString(),
                          child: Text(c['name']),
                        ))
                  ],
                  onChanged: (val) => setState(() => _filters['categoryId'] = val),
                ),
          const SizedBox(height: 16),

          // Government Level
          const Text('Government Level', style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          DropdownButtonFormField<String>(
            decoration: const InputDecoration(labelText: 'Select Level'),
            initialValue: _filters['governmentLevel'],
            items: const [
              DropdownMenuItem(value: null, child: Text('Any Level')),
              DropdownMenuItem(value: 'CENTRAL', child: Text('Central Govt')),
              DropdownMenuItem(value: 'STATE', child: Text('State Govt')),
              DropdownMenuItem(value: 'JOINT', child: Text('Joint')),
            ],
            onChanged: (val) => setState(() => _filters['governmentLevel'] = val),
          ),
          const SizedBox(height: 16),

          // Ministry (Manual input for now)
          const Text('Ministry', style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          TextFormField(
            initialValue: _filters['ministry'],
            decoration: const InputDecoration(labelText: 'E.g., Ministry of Health'),
            onChanged: (val) => _filters['ministry'] = val.isEmpty ? null : val,
          ),
          const SizedBox(height: 24),

          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () => Navigator.pop(context, _filters),
              child: const Text('Apply Filters'),
            ),
          ),
        ],
      ),
    );
  }
}
