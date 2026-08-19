import 'package:flutter/material.dart';

class EditProfilePage extends StatefulWidget {
  @override
  _EditProfilePageState createState() => _EditProfilePageState();
}

class _EditProfilePageState extends State<EditProfilePage> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _membernameController = TextEditingController();
  final TextEditingController _bioController = TextEditingController();
  final TextEditingController _websiteController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();

  bool _isPrivate = false;

  @override
  void initState() {
    super.initState();
    // Initialize with mock data
    _nameController.text = 'John Doe';
    _membernameController.text = 'johndoe';
    _bioController.text = 'Software developer and tech enthusiast';
    _websiteController.text = 'https://johndoe.com';
    _emailController.text = 'john.doe@example.com';
    _phoneController.text = '+1 (555) 123-4567';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Edit Profile'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
        actions: [
          TextButton(
            onPressed: () {
              // Save profile
              Navigator.pop(context);
            },
            child: Text(
              'Save',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: ListView(
          children: [
            Center(
              child: Stack(
                children: [
                  Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.grey[200],
                    ),
                    child: Icon(
                      Icons.person,
                      size: 50,
                      color: Colors.grey[600],
                    ),
                  ),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: Container(
                      width: 30,
                      height: 30,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.deepPurple,
                      ),
                      child: Icon(
                        Icons.camera_alt,
                        size: 16,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: 16),
            _buildTextField('Name', _nameController),
            _buildTextField('membername', _membernameController),
            _buildTextField('Bio', _bioController, maxLines: 3),
            _buildTextField('Website', _websiteController),
            _buildTextField('Email', _emailController),
            _buildTextField('Phone', _phoneController),
            SizedBox(height: 16),
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Account Privacy',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Private Account'),
                      Switch(
                        value: _isPrivate,
                        onChanged: (value) {
                          setState(() {
                            _isPrivate = value;
                          });
                        },
                      ),
                    ],
                  ),
                  SizedBox(height: 8),
                  Text(
                    'When your account is private, only people you approve can see your photos and videos.',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: 16),
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Account Settings',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 8),
                  _buildSettingsItem(
                    'Change Password',
                    Icons.lock,
                    () {
                      // Navigate to change password
                    },
                  ),
                  Divider(height: 1),
                  _buildSettingsItem(
                    'Two-Factor Authentication',
                    Icons.phonelink_setup,
                    () {
                      // Navigate to 2FA settings
                    },
                  ),
                  Divider(height: 1),
                  _buildSettingsItem(
                    'Email Notifications',
                    Icons.email,
                    () {
                      Navigator.pushNamed(context, '/notification-settings');
                    },
                  ),
                  Divider(height: 1),
                  _buildSettingsItem(
                    'Privacy Settings',
                    Icons.privacy_tip,
                    () {
                      Navigator.pushNamed(context, '/privacy-settings');
                    },
                  ),
                ],
              ),
            ),
            SizedBox(height: 16),
            Container(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  // Save profile
                  Navigator.pop(context);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.deepPurple,
                  foregroundColor: Colors.white,
                  padding: EdgeInsets.symmetric(vertical: 16),
                ),
                child: Text('Save Changes'),
              ),
            ),
            SizedBox(height: 8),
            Container(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: () {
                  // Logout
                },
                style: OutlinedButton.styleFrom(
                  side: BorderSide(color: Colors.red),
                  foregroundColor: Colors.red,
                  padding: EdgeInsets.symmetric(vertical: 16),
                ),
                child: Text('Log Out'),
              ),
            ),
            SizedBox(height: 8),
            Container(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: () {
                  // Delete account
                },
                style: OutlinedButton.styleFrom(
                  side: BorderSide(color: Colors.red),
                  foregroundColor: Colors.red,
                  padding: EdgeInsets.symmetric(vertical: 16),
                ),
                child: Text('Delete Account'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTextField(String label, TextEditingController controller, {int maxLines = 1}) {
    return Padding(
      padding: EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
          SizedBox(height: 8),
          TextField(
            controller: controller,
            maxLines: maxLines,
            decoration: InputDecoration(
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              contentPadding: EdgeInsets.all(12),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSettingsItem(String title, IconData icon, VoidCallback onTap) {
    return ListTile(
      leading: Icon(icon, color: Colors.deepPurple),
      title: Text(title),
      trailing: Icon(Icons.arrow_forward_ios, size: 16),
      onTap: onTap,
    );
  }
}