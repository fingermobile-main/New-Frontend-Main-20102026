import 'package:flutter/material.dart';

class AccountDeletionPage extends StatefulWidget {
  const AccountDeletionPage({super.key});

  @override
  State<AccountDeletionPage> createState() => _AccountDeletionPageState();
}

class _AccountDeletionPageState extends State<AccountDeletionPage> {
  bool _isLoading = false;
  String? _errorMessage;
  bool _confirmDelete = false;
  final TextEditingController _passwordController = TextEditingController();

  Future<void> _deleteAccount() async {
    if (!_confirmDelete) {
      setState(() {
        _errorMessage = 'Please confirm account deletion';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate account deletion process
      await Future.delayed(const Duration(seconds: 2));
      
      // In a real app, this would:
      // 1. Validate password
      // 2. Send deletion request to backend
      // 3. Handle response
      
      if (mounted) {
        // Show success dialog
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: const Text('Account Deleted'),
              content: const Text(
                  'Your account has been successfully deleted. You will be redirected to the login page.'),
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                    // Navigate to login page
                    Navigator.of(context).popUntil((route) => route.isFirst);
                  },
                  child: const Text('OK'),
                ),
              ],
            );
          },
        );
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'Failed to delete account. Please try again.';
        });
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  void dispose() {
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Delete Account'),
        backgroundColor: Theme.of(context).colorScheme.error,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Delete Your Account',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'Warning: This action is irreversible and will permanently delete all your data.',
              style: TextStyle(
                color: Colors.red,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Before proceeding, please note:',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            const ListTile(
              leading: Icon(Icons.data_usage, color: Colors.blue),
              title: Text('Data Deletion'),
              subtitle: Text(
                  'All your personal data, posts, messages, and media will be permanently deleted.'),
            ),
            const ListTile(
              leading: Icon(Icons.group, color: Colors.green),
              title: Text('Connections Lost'),
              subtitle: Text(
                  'You will be removed from all groups and lose connections with other members.'),
            ),
            const ListTile(
              leading: Icon(Icons.payment, color: Colors.orange),
              title: Text('No Refunds'),
              subtitle: Text(
                  'Any paid subscriptions or services will not be refunded.'),
            ),
            const SizedBox(height: 24),
            const Text(
              'To confirm deletion, please enter your password:',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _passwordController,
              obscureText: true,
              decoration: const InputDecoration(
                labelText: 'Password',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Checkbox(
                  value: _confirmDelete,
                  onChanged: (bool? value) {
                    setState(() {
                      _confirmDelete = value ?? false;
                    });
                  },
                ),
                const Expanded(
                  child: Text(
                    'I understand that this action is permanent and cannot be undone.',
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            if (_errorMessage != null)
              Text(
                _errorMessage!,
                style: const TextStyle(color: Colors.red),
              ),
            const SizedBox(height: 16),
            Center(
              child: ElevatedButton(
                onPressed: _isLoading ? null : _deleteAccount,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).colorScheme.error,
                  foregroundColor: Colors.white,
                ),
                child: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('Delete Account Permanently'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}