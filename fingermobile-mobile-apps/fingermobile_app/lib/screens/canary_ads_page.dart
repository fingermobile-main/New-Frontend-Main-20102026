import 'package:flutter/material.dart';

class CanaryAdsPage extends StatefulWidget {
  const CanaryAdsPage({super.key});

  @override
  State<CanaryAdsPage> createState() => _CanaryAdsPageState();
}

class _CanaryAdsPageState extends State<CanaryAdsPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<AdCampaign> _campaigns = [];
  List<AdPerformance> _performanceMetrics = [];
  List<AdTargeting> _targetingOptions = [];
  int _selectedCampaignIndex = -1;
  bool _isCreatingCampaign = false;

  @override
  void initState() {
    super.initState();
    _loadAdCampaigns();
  }

  Future<void> _loadAdCampaigns() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));
      
      // Mock ad campaigns data
      setState(() {
        _campaigns = [
          AdCampaign(
            id: 1,
            name: 'Summer Sale Promotion',
            status: CampaignStatus.active,
            budget: 5000,
            spent: 2450,
            impressions: 125430,
            clicks: 3240,
            ctr: 2.58,
            startDate: DateTime.now().subtract(const Duration(days: 10)),
            endDate: DateTime.now().add(const Duration(days: 20)),
          ),
          AdCampaign(
            id: 2,
            name: 'New Product Launch',
            status: CampaignStatus.paused,
            budget: 10000,
            spent: 7500,
            impressions: 89200,
            clicks: 4120,
            ctr: 4.62,
            startDate: DateTime.now().subtract(const Duration(days: 5)),
            endDate: DateTime.now().add(const Duration(days: 25)),
          ),
          AdCampaign(
            id: 3,
            name: 'Brand Awareness Campaign',
            status: CampaignStatus.completed,
            budget: 7500,
            spent: 7500,
            impressions: 210500,
            clicks: 5680,
            ctr: 2.70,
            startDate: DateTime.now().subtract(const Duration(days: 30)),
            endDate: DateTime.now().subtract(const Duration(days: 5)),
          ),
        ];
        
        _performanceMetrics = [
          AdPerformance(
            metric: 'Impressions',
            value: '425,130',
            change: '+12.4%',
            trend: Trend.up,
          ),
          AdPerformance(
            metric: 'Clicks',
            value: '13,040',
            change: '+8.2%',
            trend: Trend.up,
          ),
          AdPerformance(
            metric: 'CTR',
            value: '3.07%',
            change: '-0.3%',
            trend: Trend.down,
          ),
          AdPerformance(
            metric: 'Conversions',
            value: '1,240',
            change: '+15.7%',
            trend: Trend.up,
          ),
        ];
        
        _targetingOptions = [
          AdTargeting(
            id: 1,
            name: 'Demographics',
            description: 'Age, gender, income',
            icon: Icons.people,
          ),
          AdTargeting(
            id: 2,
            name: 'Interests',
            description: 'Hobbies, preferences',
            icon: Icons.favorite,
          ),
          AdTargeting(
            id: 3,
            name: 'Behavior',
            description: 'Purchase history, usage',
            icon: Icons.track_changes,
          ),
          AdTargeting(
            id: 4,
            name: 'Location',
            description: 'Geographic targeting',
            icon: Icons.location_on,
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load ad campaigns. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _createNewCampaign() {
    setState(() {
      _isCreatingCampaign = true;
      _selectedCampaignIndex = -1;
    });
  }

  void _saveCampaign() {
    setState(() {
      _isCreatingCampaign = false;
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Campaign saved successfully'),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _cancelCreation() {
    setState(() {
      _isCreatingCampaign = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Canary Ads'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadAdCampaigns,
          ),
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: _createNewCampaign,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadAdCampaigns,
        child: _isLoading && _campaigns.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _campaigns.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadAdCampaigns,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : _isCreatingCampaign
                    ? _buildCampaignCreationForm()
                    : SingleChildScrollView(
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Performance Metrics
                              const Text(
                                'Performance Overview',
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
                                  childAspectRatio: 1.5,
                                ),
                                itemCount: _performanceMetrics.length,
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                itemBuilder: (context, index) {
                                  var metric = _performanceMetrics[index];
                                  return Card(
                                    child: Padding(
                                      padding: const EdgeInsets.all(16.0),
                                      child: Column(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: [
                                          Text(
                                            metric.metric,
                                            style: const TextStyle(
                                              fontSize: 14,
                                              color: Colors.grey,
                                            ),
                                          ),
                                          const SizedBox(height: 8),
                                          Text(
                                            metric.value,
                                            style: const TextStyle(
                                              fontSize: 20,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                          const SizedBox(height: 8),
                                          Row(
                                            mainAxisAlignment: MainAxisAlignment.center,
                                            children: [
                                              Icon(
                                                metric.trend == Trend.up 
                                                  ? Icons.trending_up 
                                                  : Icons.trending_down,
                                                color: metric.trend == Trend.up 
                                                  ? Colors.green 
                                                  : Colors.red,
                                                size: 16,
                                              ),
                                              const SizedBox(width: 4),
                                              Text(
                                                metric.change,
                                                style: TextStyle(
                                                  color: metric.trend == Trend.up 
                                                    ? Colors.green 
                                                    : Colors.red,
                                                  fontSize: 12,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ),
                                  );
                                },
                              ),
                              const SizedBox(height: 32),
                              // Targeting Options
                              const Text(
                                'Targeting Options',
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
                                  childAspectRatio: 1.2,
                                ),
                                itemCount: _targetingOptions.length,
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                itemBuilder: (context, index) {
                                  var option = _targetingOptions[index];
                                  return Card(
                                    child: Padding(
                                      padding: const EdgeInsets.all(16.0),
                                      child: Column(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: [
                                          Icon(
                                            option.icon,
                                            color: Theme.of(context).primaryColor,
                                            size: 32,
                                          ),
                                          const SizedBox(height: 8),
                                          Text(
                                            option.name,
                                            style: const TextStyle(
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            option.description,
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
                              // Campaigns
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  const Text(
                                    'Ad Campaigns',
                                    style: TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  Text('${_campaigns.length} campaigns'),
                                ],
                              ),
                              const SizedBox(height: 16),
                              ListView.builder(
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                itemCount: _campaigns.length,
                                itemBuilder: (context, index) {
                                  var campaign = _campaigns[index];
                                  return Card(
                                    margin: const EdgeInsets.only(bottom: 16),
                                    child: ExpansionTile(
                                      title: Text(
                                        campaign.name,
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          color: _getCampaignStatusColor(campaign.status),
                                        ),
                                      ),
                                      subtitle: Text(_getCampaignStatusText(campaign.status)),
                                      children: [
                                        Padding(
                                          padding: const EdgeInsets.all(16.0),
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              _buildCampaignMetric(
                                                'Budget',
                                                '\$${campaign.budget.toStringAsFixed(2)}',
                                              ),
                                              _buildCampaignMetric(
                                                'Spent',
                                                '\$${campaign.spent.toStringAsFixed(2)}',
                                              ),
                                              _buildCampaignMetric(
                                                'Impressions',
                                                campaign.impressions.toString(),
                                              ),
                                              _buildCampaignMetric(
                                                'Clicks',
                                                campaign.clicks.toString(),
                                              ),
                                              _buildCampaignMetric(
                                                'CTR',
                                                '${campaign.ctr.toStringAsFixed(2)}%',
                                              ),
                                              const SizedBox(height: 16),
                                              Row(
                                                children: [
                                                  Expanded(
                                                    child: Text(
                                                      'Duration: ${_formatDate(campaign.startDate)} - ${_formatDate(campaign.endDate)}',
                                                      style: const TextStyle(
                                                        fontSize: 12,
                                                      ),
                                                    ),
                                                  ),
                                                  Row(
                                                    children: [
                                                      IconButton(
                                                        icon: const Icon(Icons.edit),
                                                        onPressed: () {
                                                          setState(() {
                                                            _selectedCampaignIndex = index;
                                                            _isCreatingCampaign = true;
                                                          });
                                                        },
                                                      ),
                                                      IconButton(
                                                        icon: const Icon(Icons.delete),
                                                        onPressed: () {
                                                          setState(() {
                                                            _campaigns.removeAt(index);
                                                          });
                                                        },
                                                      ),
                                                    ],
                                                  ),
                                                ],
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                  );
                                },
                              ),
                            ],
                          ),
                        ),
                      ),
      ),
    );
  }

  Widget _buildCampaignCreationForm() {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              _isCreatingCampaign ? 'Create New Campaign' : 'Edit Campaign',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 24),
            TextFormField(
              decoration: const InputDecoration(
                labelText: 'Campaign Name',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextFormField(
              decoration: const InputDecoration(
                labelText: 'Budget (\$)',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    decoration: const InputDecoration(
                      labelText: 'Start Date',
                      border: OutlineInputBorder(),
                    ),
                    readOnly: true,
                    onTap: () async {
                      DateTime? pickedDate = await showDatePicker(
                        context: context,
                        initialDate: DateTime.now(),
                        firstDate: DateTime(2020),
                        lastDate: DateTime(2030),
                      );
                    },
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: TextFormField(
                    decoration: const InputDecoration(
                      labelText: 'End Date',
                      border: OutlineInputBorder(),
                    ),
                    readOnly: true,
                    onTap: () async {
                      DateTime? pickedDate = await showDatePicker(
                        context: context,
                        initialDate: DateTime.now().add(const Duration(days: 30)),
                        firstDate: DateTime(2020),
                        lastDate: DateTime(2030),
                      );
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            const Text(
              'Targeting',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _targetingOptions.length,
              itemBuilder: (context, index) {
                var option = _targetingOptions[index];
                return Card(
                  child: ListTile(
                    leading: Icon(option.icon),
                    title: Text(option.name),
                    subtitle: Text(option.description),
                    trailing: Switch(
                      value: true,
                      onChanged: (value) {},
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton(
                  onPressed: _saveCampaign,
                  child: const Text('Save Campaign'),
                ),
                OutlinedButton(
                  onPressed: _cancelCreation,
                  child: const Text('Cancel'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCampaignMetric(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: const TextStyle(
                color: Colors.grey,
              ),
            ),
          ),
          Text(value),
        ],
      ),
    );
  }

  Color _getCampaignStatusColor(CampaignStatus status) {
    switch (status) {
      case CampaignStatus.active:
        return Colors.green;
      case CampaignStatus.paused:
        return Colors.orange;
      case CampaignStatus.completed:
        return Colors.blue;
      case CampaignStatus.draft:
        return Colors.grey;
    }
  }

  String _getCampaignStatusText(CampaignStatus status) {
    switch (status) {
      case CampaignStatus.active:
        return 'Active';
      case CampaignStatus.paused:
        return 'Paused';
      case CampaignStatus.completed:
        return 'Completed';
      case CampaignStatus.draft:
        return 'Draft';
    }
  }

  String _formatDate(DateTime date) {
    return '${date.month}/${date.day}/${date.year}';
  }
}

enum CampaignStatus { active, paused, completed, draft }
enum Trend { up, down }

class AdCampaign {
  final int id;
  final String name;
  final CampaignStatus status;
  final double budget;
  final double spent;
  final int impressions;
  final int clicks;
  final double ctr; // Click-through rate
  final DateTime startDate;
  final DateTime endDate;

  AdCampaign({
    required this.id,
    required this.name,
    required this.status,
    required this.budget,
    required this.spent,
    required this.impressions,
    required this.clicks,
    required this.ctr,
    required this.startDate,
    required this.endDate,
  });
}

class AdPerformance {
  final String metric;
  final String value;
  final String change;
  final Trend trend;

  AdPerformance({
    required this.metric,
    required this.value,
    required this.change,
    required this.trend,
  });
}

class AdTargeting {
  final int id;
  final String name;
  final String description;
  final IconData icon;

  AdTargeting({
    required this.id,
    required this.name,
    required this.description,
    required this.icon,
  });
}