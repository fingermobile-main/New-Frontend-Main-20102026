import 'package:flutter/material.dart';

class MarketingPage extends StatefulWidget {
  const MarketingPage({super.key});

  @override
  State<MarketingPage> createState() => _MarketingPageState();
}

class _MarketingPageState extends State<MarketingPage> {
  bool _isLoading = false;
  String? _errorMessage;
  CampaignData? _campaignData;
  List<MarketingCampaign> _campaigns = [];
  List<CampaignMetric> _metrics = [];
  int _activeTab = 0;

  @override
  void initState() {
    super.initState();
    _loadMarketingData();
  }

  Future<void> _loadMarketingData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock marketing data
      setState(() {
        _campaignData = CampaignData(
          totalCampaigns: 15,
          activeCampaigns: 4,
          totalBudget: 125000,
          spentBudget: 82000,
          earnedRevenue: 340000,
          roi: 3.12,
        );

        _campaigns = [
          MarketingCampaign(
            id: 1,
            name: 'Summer Sale Campaign',
            status: CampaignStatus.active,
            startDate: DateTime.now().subtract(const Duration(days: 15)),
            endDate: DateTime.now().add(const Duration(days: 10)),
            budget: 30000,
            spent: 18500,
            channel: CampaignChannel.email,
            audienceSize: 50000,
            conversionRate: 4.2,
          ),
          MarketingCampaign(
            id: 2,
            name: 'New member Acquisition',
            status: CampaignStatus.completed,
            startDate: DateTime.now().subtract(const Duration(days: 45)),
            endDate: DateTime.now().subtract(const Duration(days: 5)),
            budget: 45000,
            spent: 45000,
            channel: CampaignChannel.socialMedia,
            audienceSize: 200000,
            conversionRate: 2.8,
          ),
          MarketingCampaign(
            id: 3,
            name: 'Feature Promotion',
            status: CampaignStatus.draft,
            startDate: DateTime.now().add(const Duration(days: 7)),
            endDate: DateTime.now().add(const Duration(days: 30)),
            budget: 20000,
            spent: 0,
            channel: CampaignChannel.inApp,
            audienceSize: 0,
            conversionRate: 0,
          ),
        ];

        _metrics = [
          CampaignMetric(
            id: 'impressions',
            title: 'Total Impressions',
            value: '2.4M',
            change: 15.2,
            icon: Icons.visibility,
            color: Colors.blue,
          ),
          CampaignMetric(
            id: 'clicks',
            title: 'Total Clicks',
            value: '415K',
            change: 8.7,
            icon: Icons.touch_app,
            color: Colors.green,
          ),
          CampaignMetric(
            id: 'conversions',
            title: 'Total Conversions',
            value: '28.5K',
            change: 12.3,
            icon: Icons.conversion_path,
            color: Colors.orange,
          ),
          CampaignMetric(
            id: 'revenue',
            title: 'Total Revenue',
            value: '\$890K',
            change: 18.1,
            icon: Icons.attach_money,
            color: Colors.purple,
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load marketing data. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Marketing'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadMarketingData,
          ),
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              // Create new campaign
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Create new campaign functionality would open here'),
                  backgroundColor: Colors.blue,
                ),
              );
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadMarketingData,
        child: _isLoading && _campaignData == null
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _campaignData == null
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadMarketingData,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : SingleChildScrollView(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Overview Card
                          if (_campaignData != null)
                            Card(
                              child: Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text(
                                      'Marketing Overview',
                                      style: TextStyle(
                                        fontSize: 20,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    const SizedBox(height: 16),
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                                      children: [
                                        _buildOverviewItem(
                                          'Active Campaigns',
                                          '${_campaignData!.activeCampaigns}',
                                          Icons.campaign,
                                        ),
                                        _buildOverviewItem(
                                          'Budget Spent',
                                          '\$${_formatCurrency(_campaignData!.spentBudget)}',
                                          Icons.account_balance_wallet,
                                        ),
                                        _buildOverviewItem(
                                          'ROI',
                                          '${_campaignData!.roi}x',
                                          Icons.show_chart,
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 16),
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                                      children: [
                                        _buildOverviewItem(
                                          'Total Campaigns',
                                          '${_campaignData!.totalCampaigns}',
                                          Icons.dashboard,
                                        ),
                                        _buildOverviewItem(
                                          'Total Budget',
                                          '\$${_formatCurrency(_campaignData!.totalBudget)}',
                                          Icons.account_balance,
                                        ),
                                        _buildOverviewItem(
                                          'Revenue',
                                          '\$${_formatCurrency(_campaignData!.earnedRevenue)}',
                                          Icons.money,
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          const SizedBox(height: 32),
                          // Key Metrics
                          const Text(
                            'Key Metrics',
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
                            itemCount: _metrics.length,
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemBuilder: (context, index) {
                              var metric = _metrics[index];
                              return Card(
                                child: Padding(
                                  padding: const EdgeInsets.all(16.0),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Container(
                                            padding: const EdgeInsets.all(12),
                                            decoration: BoxDecoration(
                                              color: metric.color.withOpacity(0.1),
                                              shape: BoxShape.circle,
                                            ),
                                            child: Icon(
                                              metric.icon,
                                              color: metric.color,
                                            ),
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 12,
                                              vertical: 6,
                                            ),
                                            decoration: BoxDecoration(
                                              color: metric.change >= 0
                                                  ? Colors.green.shade100
                                                  : Colors.red.shade100,
                                              borderRadius: BorderRadius.circular(12),
                                            ),
                                            child: Row(
                                              children: [
                                                Icon(
                                                  metric.change >= 0
                                                      ? Icons.trending_up
                                                      : Icons.trending_down,
                                                  size: 16,
                                                  color: metric.change >= 0
                                                      ? Colors.green
                                                      : Colors.red,
                                                ),
                                                const SizedBox(width: 4),
                                                Text(
                                                  '${metric.change >= 0 ? '+' : ''}${metric.change.toStringAsFixed(1)}%',
                                                  style: TextStyle(
                                                    color: metric.change >= 0
                                                        ? Colors.green
                                                        : Colors.red,
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        metric.title,
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 16,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        metric.value,
                                        style: const TextStyle(
                                          fontSize: 24,
                                          fontWeight: FontWeight.bold,
                                        ),
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
                                'Campaigns',
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              TextButton(
                                onPressed: () {
                                  // View all campaigns
                                },
                                child: const Text('View All'),
                              ),
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
                                child: Padding(
                                  padding: const EdgeInsets.all(16.0),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(
                                            campaign.name,
                                            style: const TextStyle(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 18,
                                            ),
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 12,
                                              vertical: 6,
                                            ),
                                            decoration: BoxDecoration(
                                              color: _getCampaignStatusColor(campaign.status),
                                              borderRadius: BorderRadius.circular(12),
                                            ),
                                            child: Text(
                                              _getCampaignStatusText(campaign.status),
                                              style: const TextStyle(
                                                color: Colors.white,
                                                fontWeight: FontWeight.bold,
                                                fontSize: 12,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 8),
                                      Row(
                                        children: [
                                          Icon(
                                            _getCampaignChannelIcon(campaign.channel),
                                            size: 16,
                                            color: Colors.grey,
                                          ),
                                          const SizedBox(width: 8),
                                          Text(
                                            _getCampaignChannelText(campaign.channel),
                                            style: const TextStyle(
                                              color: Colors.grey,
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 16),
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          _buildCampaignInfo(
                                            'Budget',
                                            '\$${_formatCurrency(campaign.budget)}',
                                          ),
                                          _buildCampaignInfo(
                                            'Spent',
                                            '\$${_formatCurrency(campaign.spent)}',
                                          ),
                                          _buildCampaignInfo(
                                            'Conversion',
                                            '${campaign.conversionRate}%',
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 16),
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          _buildCampaignInfo(
                                            'Audience',
                                            _formatNumber(campaign.audienceSize),
                                          ),
                                          _buildCampaignInfo(
                                            'Duration',
                                            '${campaign.startDate.month}/${campaign.startDate.day} - ${campaign.endDate.month}/${campaign.endDate.day}',
                                          ),
                                          if (campaign.status == CampaignStatus.draft)
                                            TextButton(
                                              onPressed: () {
                                                // Launch campaign
                                              },
                                              child: const Text('Launch'),
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
                          // Performance Chart
                          Card(
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Performance Trends',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 18,
                                    ),
                                  ),
                                  const SizedBox(height: 16),
                                  SizedBox(
                                    height: 200,
                                    child: CustomPaint(
                                      painter: ChartPainter(),
                                      size: const Size(double.infinity, 200),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
      ),
    );
  }

  Widget _buildOverviewItem(String label, String value, IconData icon) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, size: 16, color: Colors.grey),
            const SizedBox(width: 4),
            Text(label, style: const TextStyle(color: Colors.grey, fontSize: 12)),
          ],
        ),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
      ],
    );
  }

  Widget _buildCampaignInfo(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: Colors.grey,
            fontSize: 12,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Color _getCampaignStatusColor(CampaignStatus status) {
    switch (status) {
      case CampaignStatus.active:
        return Colors.green;
      case CampaignStatus.completed:
        return Colors.blue;
      case CampaignStatus.draft:
        return Colors.orange;
    }
  }

  String _getCampaignStatusText(CampaignStatus status) {
    switch (status) {
      case CampaignStatus.active:
        return 'Active';
      case CampaignStatus.completed:
        return 'Completed';
      case CampaignStatus.draft:
        return 'Draft';
    }
  }

  IconData _getCampaignChannelIcon(CampaignChannel channel) {
    switch (channel) {
      case CampaignChannel.email:
        return Icons.email;
      case CampaignChannel.socialMedia:
        return Icons.share;
      case CampaignChannel.inApp:
        return Icons.mobile_friendly;
      case CampaignChannel.paidAds:
        return Icons.ad_units;
    }
  }

  String _getCampaignChannelText(CampaignChannel channel) {
    switch (channel) {
      case CampaignChannel.email:
        return 'Email Marketing';
      case CampaignChannel.socialMedia:
        return 'Social Media';
      case CampaignChannel.inApp:
        return 'In-App Promotion';
      case CampaignChannel.paidAds:
        return 'Paid Advertising';
    }
  }

  String _formatCurrency(int amount) {
    final formatter = NumberFormat('#,##0');
    return formatter.format(amount);
  }

  String _formatNumber(int number) {
    if (number >= 1000000) {
      return '${(number / 1000000).toStringAsFixed(1)}M';
    } else if (number >= 1000) {
      return '${(number / 1000).toStringAsFixed(1)}K';
    } else {
      return number.toString();
    }
  }
}

// Import for NumberFormat
import 'package:intl/intl.dart';

enum CampaignStatus { active, completed, draft }
enum CampaignChannel { email, socialMedia, inApp, paidAds }

class CampaignData {
  final int totalCampaigns;
  final int activeCampaigns;
  final int totalBudget;
  final int spentBudget;
  final int earnedRevenue;
  final double roi;

  CampaignData({
    required this.totalCampaigns,
    required this.activeCampaigns,
    required this.totalBudget,
    required this.spentBudget,
    required this.earnedRevenue,
    required this.roi,
  });
}

class MarketingCampaign {
  final int id;
  final String name;
  final CampaignStatus status;
  final DateTime startDate;
  final DateTime endDate;
  final int budget;
  final int spent;
  final CampaignChannel channel;
  final int audienceSize;
  final double conversionRate;

  MarketingCampaign({
    required this.id,
    required this.name,
    required this.status,
    required this.startDate,
    required this.endDate,
    required this.budget,
    required this.spent,
    required this.channel,
    required this.audienceSize,
    required this.conversionRate,
  });
}

class CampaignMetric {
  final String id;
  final String title;
  final String value;
  final double change;
  final IconData icon;
  final Color color;

  CampaignMetric({
    required this.id,
    required this.title,
    required this.value,
    required this.change,
    required this.icon,
    required this.color,
  });
}

class ChartPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.blue
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    final fillPaint = Paint()
      ..color = Colors.blue.withOpacity(0.2)
      ..style = PaintingStyle.fill;

    final path = Path();
    final fillPath = Path();

    // Create some mock data points
    final data = [
      Offset(0, size.height * 0.8),
      Offset(size.width * 0.2, size.height * 0.6),
      Offset(size.width * 0.4, size.height * 0.4),
      Offset(size.width * 0.6, size.height * 0.5),
      Offset(size.width * 0.8, size.height * 0.3),
      Offset(size.width, size.height * 0.4),
    ];

    // Draw the chart
    if (data.isNotEmpty) {
      // Fill the area under the line
      fillPath.moveTo(data[0].dx, data[0].dy);
      for (int i = 1; i < data.length; i++) {
        fillPath.lineTo(data[i].dx, data[i].dy);
      }
      // Close the path to create a filled area
      fillPath.lineTo(size.width, size.height);
      fillPath.lineTo(data[0].dx, data[0].dy);
      fillPath.close();
      canvas.drawPath(fillPath, fillPaint);

      // Draw the line chart
      path.moveTo(data[0].dx, data[0].dy);
      for (int i = 1; i < data.length; i++) {
        path.lineTo(data[i].dx, data[i].dy);
      }
      canvas.drawPath(path, paint);

      // Draw data points
      for (int i = 0; i < data.length; i++) {
        canvas.drawCircle(data[i], 5, paint);
      }
    }

    // Draw axes
    final axisPaint = Paint()
      ..color = Colors.grey
      ..strokeWidth = 1;

    // X-axis
    canvas.drawLine(
      Offset(0, size.height),
      Offset(size.width, size.height),
      axisPaint,
    );

    // Y-axis
    canvas.drawLine(
      Offset(0, 0),
      Offset(0, size.height),
      axisPaint,
    );

    // Add labels
    final textPainter = TextPainter(
      textAlign: TextAlign.center,
      textDirection: TextDirection.ltr,
    );

    // X-axis labels
    final xLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];
    for (int i = 0; i < xLabels.length; i++) {
      textPainter.text = TextSpan(
        text: xLabels[i],
        style: const TextStyle(
          color: Colors.grey,
          fontSize: 10,
        ),
      );
      
      textPainter.layout();
      textPainter.paint(
        canvas,
        Offset(i * (size.width / (xLabels.length - 1)), size.height + 4),
      );
    }

    // Y-axis labels
    final yLabels = ['0', '25%', '50%', '75%', '100%'];
    for (int i = 0; i < yLabels.length; i++) {
      final y = size.height - (i * (size.height / (yLabels.length - 1)));
      textPainter.text = TextSpan(
        text: yLabels[i],
        style: const TextStyle(
          color: Colors.grey,
          fontSize: 10,
        ),
      );
      
      textPainter.layout();
      textPainter.paint(
        canvas,
        Offset(-textPainter.width - 4, y - textPainter.height / 2),
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return true;
  }
}