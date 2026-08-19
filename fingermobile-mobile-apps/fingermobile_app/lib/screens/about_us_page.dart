import 'package:flutter/material.dart';

class AboutUsPage extends StatefulWidget {
  const AboutUsPage({super.key});

  @override
  State<AboutUsPage> createState() => _AboutUsPageState();
}

class _AboutUsPageState extends State<AboutUsPage> {
  bool _isLoading = false;
  String? _errorMessage;

  Future<void> _loadContent() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));
      // In a real app, this would fetch from an API
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load content. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  void initState() {
    super.initState();
    _loadContent();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('About Us'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
      ),
      body: RefreshIndicator(
        onRefresh: _loadContent,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: _isLoading
              ? const Center(child: CircularProgressIndicator())
              : _errorMessage != null
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(_errorMessage!),
                          const SizedBox(height: 16),
                          ElevatedButton(
                            onPressed: _loadContent,
                            child: const Text('Retry'),
                          ),
                        ],
                      ),
                    )
                  : SingleChildScrollView(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Our Story',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          const Text(
                            'FingerMobile was founded with a vision to revolutionize mobile communication '
                            'by bridging various protocols and services into a seamless member experience. '
                            'Since our inception, we have been committed to providing innovative solutions '
                            'that empower members to connect, communicate, and collaborate effortlessly.',
                            style: TextStyle(fontSize: 16, height: 1.5),
                          ),
                          const SizedBox(height: 24),
                          const Text(
                            'Our Mission',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          const Text(
                            'Our mission is to create a unified platform that brings together the best '
                            'of mobile technology, social networking, and digital services. We strive to '
                            'break down barriers between different communication protocols and provide '
                            'members with a truly integrated experience.',
                            style: TextStyle(fontSize: 16, height: 1.5),
                          ),
                          const SizedBox(height: 24),
                          const Text(
                            'Our Values',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          const ListTile(
                            leading: Icon(Icons.security, color: Colors.blue),
                            title: Text('Security'),
                            subtitle: Text(
                                'We prioritize the safety and privacy of our members\' data.'),
                          ),
                          const ListTile(
                            leading: Icon(Icons.innovation, color: Colors.green),
                            title: Text('Innovation'),
                            subtitle: Text(
                                'Constantly pushing boundaries to deliver cutting-edge features.'),
                          ),
                          const ListTile(
                            leading: Icon(Icons.people, color: Colors.orange),
                            title: Text('member-Centric'),
                            subtitle: Text(
                                'Placing our members at the heart of everything we do.'),
                          ),
                          const ListTile(
                            leading: Icon(Icons.handshake, color: Colors.purple),
                            title: Text('Integrity'),
                            subtitle: Text(
                                'Maintaining transparency and honesty in all our dealings.'),
                          ),
                        ],
                      ),
                    ),
        ),
      ),
    );
  }
}