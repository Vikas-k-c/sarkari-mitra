import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sarkari_mitra/features/profile/providers/profile_provider.dart';

class ProfileSetupScreen extends ConsumerStatefulWidget {
  const ProfileSetupScreen({super.key});
  @override
  ConsumerState<ProfileSetupScreen> createState() => _ProfileSetupScreenState();
}

class _ProfileSetupScreenState extends ConsumerState<ProfileSetupScreen> {
  final _formKey = GlobalKey<FormState>();

  int _age = 25;
  String _gender = 'Male';
  final _occupationController = TextEditingController();
  final _incomeController = TextEditingController();
  final _educationController = TextEditingController();
  final _stateController = TextEditingController();
  final _districtController = TextEditingController();
  String _category = 'General';
  String _education = 'Below 10th';

  final List<String> _genderOptions = ['Male', 'Female', 'Other'];
  final List<String> _categoryOptions = ['General', 'OBC', 'SC', 'ST', 'Minority'];
  final List<String> _educationOptions = ['Below 10th', '10th', 'PUC', 'Degree', 'Post Graduate'];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final profileState = ref.read(profileProvider);
      if (profileState.isComplete && profileState.profile != null) {
        final p = profileState.profile!;
        setState(() {
          _age = p['age'] ?? 25;
          _gender = _genderOptions.contains(p['gender']) ? p['gender'] : 'Male';
          _occupationController.text = p['occupation'] ?? '';
          _incomeController.text = (p['income'] ?? '').toString();
          _education = _educationOptions.contains(p['education']) ? p['education'] : 'Below 10th';
          _stateController.text = p['state'] ?? '';
          _districtController.text = p['district'] ?? '';
          _category = _categoryOptions.contains(p['category']) ? p['category'] : 'General';});
  }});
  }

  @override
  void dispose() {
    _occupationController.dispose();
    _incomeController.dispose();
    _educationController.dispose();
    _stateController.dispose();
    _districtController.dispose();
    super.dispose();
  }

  void _submit() async {
    if (_formKey.currentState!.validate()) {
      final data = {
        'age': _age,
        'gender': _gender,
        'occupation': _occupationController.text.trim(),
        'income': int.tryParse(_incomeController.text.trim()) ?? 0,
        'education': _education,
        'state': _stateController.text.trim(),
        'district': _districtController.text.trim(),
        'category': _category,
      };

      final profileState = ref.read(profileProvider);
      final success = profileState.isComplete 
          ? await ref.read(profileProvider.notifier).updateProfile(data)
          : await ref.read(profileProvider.notifier).createProfile(data);

      if (!mounted) return;

      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Profile saved successfully!'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final profileState = ref.watch(profileProvider);

    ref.listen<ProfileState>(profileProvider, (previous, next) {
      if (next.error != null && (previous?.error != next.error)) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(next.error!.replaceAll('Exception: ', '')),
            backgroundColor: Colors.redAccent,
          ),
        );
      }});
  return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const Text('Complete Your Profile'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
        titleTextStyle: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
        automaticallyImplyLeading: false,
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Colors.blue.shade900, Colors.teal.shade700],
          ),
        ),
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 100.0),
            child: Container(
              constraints: const BoxConstraints(maxWidth: 500),
              padding: const EdgeInsets.all(32),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: const [
                  BoxShadow(color: Colors.black26, blurRadius: 20, offset: Offset(0, 10)),
                ],
              ),
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Icon(Icons.assignment_ind, size: 64, color: Colors.blue),
                    const SizedBox(height: 16),
                    const Text(
                      'Tell us about yourself',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.black87),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'We need this to recommend the best schemes for you.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.grey, fontSize: 14),
                    ),
                    const SizedBox(height: 32),
                    
                    // Age
                    TextFormField(
                      initialValue: _age.toString(),
                      decoration: InputDecoration(
                        labelText: 'Age',
                        prefixIcon: const Icon(Icons.calendar_today),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      keyboardType: TextInputType.number,
                      validator: (value) {
                        if (value == null || value.isEmpty) return 'Please enter your age';
                        final num = int.tryParse(value);
                        if (num == null || num < 1 || num > 120) return 'Invalid age';
                        return null;
                      },
                      onChanged: (v) => _age = int.tryParse(v) ?? _age,
                    ),
                    const SizedBox(height: 16),

                    // Gender Dropdown
                    DropdownButtonFormField<String>(
                      initialValue: _gender,
                      decoration: InputDecoration(
                        labelText: 'Gender',
                        prefixIcon: const Icon(Icons.person),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      items: _genderOptions.map((String val) {
                        return DropdownMenuItem(value: val, child: Text(val));
                      }).toList(),
                      onChanged: (newValue) => setState(() => _gender = newValue!),
                    ),
                    const SizedBox(height: 16),

                    // Occupation
                    TextFormField(
                      controller: _occupationController,
                      decoration: InputDecoration(
                        labelText: 'Occupation (e.g. Farmer, Student)',
                        prefixIcon: const Icon(Icons.work),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      validator: (value) => value == null || value.isEmpty ? 'Required' : null,
                    ),
                    const SizedBox(height: 16),

                    // Income
                    TextFormField(
                      controller: _incomeController,
                      decoration: InputDecoration(
                        labelText: 'Annual Income (₹)',
                        prefixIcon: const Icon(Icons.currency_rupee),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      keyboardType: TextInputType.number,
                      validator: (value) {
                        if (value == null || value.isEmpty) return 'Required';
                        if (int.tryParse(value) == null) return 'Must be a number';
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),

                    // Education
                    DropdownButtonFormField<String>(
                      initialValue: _education,
                      decoration: InputDecoration(
                        labelText: 'Education Qualification',
                        prefixIcon: const Icon(Icons.school),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      items: _educationOptions.map((String val) {
                        return DropdownMenuItem(value: val, child: Text(val));
                      }).toList(),
                      onChanged: (newValue) => setState(() => _education = newValue!),
                    ),
                    const SizedBox(height: 16),

                    // State
                    TextFormField(
                      controller: _stateController,
                      decoration: InputDecoration(
                        labelText: 'State',
                        prefixIcon: const Icon(Icons.map),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      validator: (value) => value == null || value.isEmpty ? 'Required' : null,
                    ),
                    const SizedBox(height: 16),

                    // District
                    TextFormField(
                      controller: _districtController,
                      decoration: InputDecoration(
                        labelText: 'District',
                        prefixIcon: const Icon(Icons.location_city),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      validator: (value) => value == null || value.isEmpty ? 'Required' : null,
                    ),
                    const SizedBox(height: 16),

                    // Category Dropdown
                    DropdownButtonFormField<String>(
                      initialValue: _category,
                      decoration: InputDecoration(
                        labelText: 'Category',
                        prefixIcon: const Icon(Icons.group),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      items: _categoryOptions.map((String val) {
                        return DropdownMenuItem(value: val, child: Text(val));
                      }).toList(),
                      onChanged: (newValue) => setState(() => _category = newValue!),
                    ),
                    const SizedBox(height: 32),

                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        backgroundColor: Colors.blue.shade800,
                        foregroundColor: Colors.white,
                        elevation: 0,
                      ),
                      onPressed: profileState.isLoading ? null : _submit,
                      child: profileState.isLoading
                          ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                          : const Text('Save Profile', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
