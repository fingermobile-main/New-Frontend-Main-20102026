import 'package:flutter/material.dart';

class CanaryPage extends StatefulWidget {
  const CanaryPage({super.key});

  @override
  State<CanaryPage> createState() => _CanaryPageState();
}

class _CanaryPageState extends State<CanaryPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<CanaryFeature> _features = [];
  List<CanaryUpdate> _recentUpdates = [];
  bool _isSubscribed = false;
  int _activeTabIndex = 0;

  @override
  void initState() {
    super.initState();
    _loadCanaryContent();
  }

  Future<void> _loadCanaryContent() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));
      
      // Mock Canary content
      setState(() {
        _features = [
          CanaryFeature(
            title: 'Early Access',
            description: 'Get early access to new features before they\'re released to the public',
            icon: Icons.rocket_launch,
            color: Colors.blue,
          ),
          CanaryFeature(
            title: 'Experimental Tools',
            description: 'Test cutting-edge tools and provide feedback to shape their development',
            icon: Icons.science,
            color: Colors.green,
          ),
          CanaryFeature(
            title: 'Priority Support',
            description: 'Receive faster responses from our support team',
            icon: Icons.support,
            color: Colors.purple,
          ),
          CanaryFeature(
            title: 'Direct Feedback',
            description: 'Have your voice heard directly by the development team',
            icon: Icons.feedback,
            color: Colors.orange,
          ),
        ];
        
        _recentUpdates = [
          CanaryUpdate(
            version: 'v2.5.0-canary.3',
            date: DateTime.now().subtract(const Duration(days: 2)),
            description: 'Added new dark mode themes and improved performance',
            isBreaking: false,
          ),
          CanaryUpdate(
            version: 'v2.5.0-canary.2',
            date: DateTime.now().subtract(const Duration(days: 5)),
            description: 'Fixed critical bug in messaging system',
            isBreaking: true,
          ),
          CanaryUpdate(
            version: 'v2.5.0-canary.1',
            date: DateTime.now().subtract(const Duration(days: 10)),
            description: 'Initial release of Canary program with new UI components',
            isBreaking: false,
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load Canary content. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _toggleSubscription() {
    setState(() {
      _isSubscribed = !_isSubscribed;
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          _isSubscribed 
            ? 'Successfully joined the Canary program!' 
            : 'Left the Canary program',
        ),
        backgroundColor: _isSubscribed ? Colors.green : Colors.orange,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Canary Program'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadCanaryContent,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadCanaryContent,
        child: _isLoading && _features.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _features.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadCanaryContent,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : SingleChildScrollView(
                    child: Column(
                      children: [
                        // Hero Section
                        Container(
                          padding: const EdgeInsets.all(32.0),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                Theme.of(context).primaryColor,
                                Theme.of(context).primaryColorDark,
                              ],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                          ),
                          child: Column(
                            children: [
                              const Text(
                                'Canary Program',
                                style: TextStyle(
                                  fontSize: 28,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                                textAlign: TextAlign.center,
                              ),
                              const SizedBox(height: 16),
                              const Text(
                                'Be among the first to experience new features and help shape the future of our platform',
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.white70,
                                ),
                                textAlign: TextAlign.center,
                              ),
                              const SizedBox(height: 32),
                              ElevatedButton(
                                onPressed: _toggleSubscription,
                                style: ElevatedButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 32,
                                    vertical: 16,
                                  ),
                                  backgroundColor: Colors.white,
                                  foregroundColor: Theme.of(context).primaryColor,
                                ),
                                child: Text(
                                  _isSubscribed 
                                    ? 'Leave Program' 
                                    : 'Join Canary Program',
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        // Tab Bar
                        Container(
                          color: Colors.grey.shade100,
                          child: Row(
                            children: [
                              _buildTab('Features', 0),
                              _buildTab('Updates', 1),
                              _buildTab('FAQ', 2),
                            ],
                          ),
                        ),
                        // Tab Content
                        if (_activeTabIndex == 0)
                          _buildFeaturesTab()
                        else if (_activeTabIndex == 1)
                          _buildUpdatesTab()
                        else
                          _buildFaqTab(),
                      ],
                    ),
                  ),
      ),
    );
  }

  Widget _buildTab(String title, int index) {
    bool isActive = _activeTabIndex == index;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            _activeTabIndex = index;
          });
        },
        child: Container(
          padding: const EdgeInsets.all(16.0),
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(
                color: isActive 
                  ? Theme.of(context).primaryColor 
                  : Colors.transparent,
                width: 3.0,
              ),
            ),
          ),
          child: Text(
            title,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
              color: isActive 
                ? Theme.of(context).primaryColor 
                : Colors.grey,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFeaturesTab() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Program Benefits',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          GridView.builder(
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              childAspectRatio: 0.85,
            ),
            itemCount: _features.length,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemBuilder: (context, index) {
              var feature = _features[index];
              return Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: feature.color.withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          feature.icon,
                          color: feature.color,
                          size: 32,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        feature.title,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        feature.description,
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
          const SizedBox(height: 32),
          const Text(
            'How It Works',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  _buildStep(1, 'Join the Program', 'Sign up for the Canary program'),
                  const Divider(),
                  _buildStep(2, 'Receive Updates', 'Get early access to new features'),
                  const Divider(),
                  _buildStep(3, 'Provide Feedback', 'Share your thoughts with our team'),
                  const Divider(),
                  _buildStep(4, 'Shape the Future', 'Help us improve before public release'),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildUpdatesTab() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Recent Updates',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _recentUpdates.length,
            itemBuilder: (context, index) {
              var update = _recentUpdates[index];
              return Card(
                margin: const EdgeInsets.only(bottom: 16),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            update.version,
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                          if (update.isBreaking)
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.red,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Text(
                                'BREAKING',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        _formatDate(update.date),
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 12,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(update.description),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildFaqTab() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Frequently Asked Questions',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          ExpansionPanelList(
            expansionCallback: (int index, bool isExpanded) {},
            children: [
              ExpansionPanel(
                headerBuilder: (context, isExpanded) {
                  return const ListTile(
                    title: Text('What is the Canary program?'),
                  );
                },
                body: const Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Text(
                    'The Canary program gives selected members early access to new features '
                    'and experimental tools. Participants help us identify issues and '
                    'provide valuable feedback before features are released to everyone.',
                  ),
                ),
                isExpanded: true,
              ),
              ExpansionPanel(
                headerBuilder: (context, isExpanded) {
                  return const ListTile(
                    title: Text('Is there a cost to join?'),
                  );
                },
                body: const Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Text(
                    'No, the Canary program is completely free. We value your feedback '
                    'and participation more than any monetary contribution.',
                  ),
                ),
                isExpanded: false,
              ),
              ExpansionPanel(
                headerBuilder: (context, isExpanded) {
                  return const ListTile(
                    title: Text('How often are updates released?'),
                  );
                },
                body: const Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Text(
                    'Canary updates are released on a weekly basis, though this may vary '
                    'depending on our development cycle. Major feature releases happen '
                    'approximately every 2-3 weeks.',
                  ),
                ),
                isExpanded: false,
              ),
              ExpansionPanel(
                headerBuilder: (context, isExpanded) {
                  return const ListTile(
                    title: Text('Can I leave the program anytime?'),
                  );
                },
                body: const Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Text(
                    'Yes, you can leave the Canary program at any time. Simply click '
                    'the "Leave Program" button on this page. You\'ll retain access to '
                    'any stable features you\'ve used.',
                  ),
                ),
                isExpanded: false,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStep(int step, String title, String description) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 30,
          height: 30,
          decoration: BoxDecoration(
            color: Theme.of(context).primaryColor,
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text(
              step.toString(),
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                description,
                style: const TextStyle(
                  color: Colors.grey,
                  fontSize: 14,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  String _formatDate(DateTime date) {
    return '${date.month}/${date.day}/${date.year}';
  }
}

class CanaryFeature {
  final String title;
  final String description;
  final IconData icon;
  final Color color;

  CanaryFeature({
    required this.title,
    required this.description,
    required this.icon,
    required this.color,
  });
}

class CanaryUpdate {
  final String version;
  final DateTime date;
  final String description;
  final bool isBreaking;

  CanaryUpdate({
    required this.version,
    required this.date,
    required this.description,
    required this.isBreaking,
  });
}