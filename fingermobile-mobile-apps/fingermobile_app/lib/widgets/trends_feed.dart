import 'package:flutter/material.dart';

class TrendsFeed extends StatefulWidget {
  @override
  _TrendsFeedState createState() => _TrendsFeedState();
}

class _TrendsFeedState extends State<TrendsFeed> {
  final List<_TrendItem> _trends = [
    _TrendItem(
      id: '1',
      title: '#FlutterDev',
      description: 'Latest updates in Flutter development',
      postCount: 12400,
      isTrending: true,
    ),
    _TrendItem(
      id: '2',
      title: '#MobileApps',
      description: 'Trending mobile applications',
      postCount: 9800,
      isTrending: true,
    ),
    _TrendItem(
      id: '3',
      title: '#FingerMobile',
      description: 'Updates about FingerMobile platform',
      postCount: 7500,
      isTrending: false,
    ),
    _TrendItem(
      id: '4',
      title: '#TechNews',
      description: 'Latest technology news',
      postCount: 6300,
      isTrending: true,
    ),
    _TrendItem(
      id: '5',
      title: '#Innovation',
      description: 'New innovations in tech',
      postCount: 5200,
      isTrending: false,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Trends'),
        actions: [
          IconButton(
            icon: Icon(Icons.tune),
            onPressed: () {
              // Show filters
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          // Simulate refreshing trends
          await Future.delayed(Duration(seconds: 1));
        },
        child: ListView.builder(
          padding: EdgeInsets.all(16),
          itemCount: _trends.length,
          itemBuilder: (context, index) {
            final trend = _trends[index];
            return _buildTrendItem(trend);
          },
        ),
      ),
    );
  }

  Widget _buildTrendItem(_TrendItem trend) {
    return Card(
      margin: EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: () {
          // Navigate to trend details
        },
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      trend.title,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  if (trend.isTrending)
                    Icon(
                      Icons.trending_up,
                      color: Colors.orange,
                    ),
                ],
              ),
              SizedBox(height: 4),
              Text(
                trend.description,
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[600],
                ),
              ),
              SizedBox(height: 8),
              Text(
                '${trend.postCount.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},')} posts',
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[500],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class TrendCard extends StatelessWidget {
  final String title;
  final String description;
  final int postCount;
  final bool isTrending;
  final VoidCallback onTap;

  const TrendCard({
    Key? key,
    required this.title,
    required this.description,
    required this.postCount,
    this.isTrending = false,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.all(8),
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      title,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  if (isTrending)
                    Icon(
                      Icons.trending_up,
                      color: Colors.orange,
                      size: 16,
                    ),
                ],
              ),
              SizedBox(height: 4),
              Text(
                description,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[600],
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              SizedBox(height: 8),
              Text(
                '${postCount.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},')} posts',
                style: TextStyle(
                  fontSize: 11,
                  color: Colors.grey[500],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class TrendsSlide extends StatefulWidget {
  final List<_TrendItem> trends;

  const TrendsSlide({
    Key? key,
    required this.trends,
  }) : super(key: key);

  @override
  _TrendsSlideState createState() => _TrendsSlideState();
}

class _TrendsSlideState extends State<TrendsSlide> {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 150,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: widget.trends.length,
        itemBuilder: (context, index) {
          final trend = widget.trends[index];
          return Container(
            width: 200,
            margin: EdgeInsets.only(right: 12),
            child: TrendCard(
              title: trend.title,
              description: trend.description,
              postCount: trend.postCount,
              isTrending: trend.isTrending,
              onTap: () {
                // Handle trend tap
              },
            ),
          );
        },
      ),
    );
  }
}

class _TrendItem {
  final String id;
  final String title;
  final String description;
  final int postCount;
  final bool isTrending;

  _TrendItem({
    required this.id,
    required this.title,
    required this.description,
    required this.postCount,
    required this.isTrending,
  });
}