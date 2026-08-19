import 'package:flutter/material.dart';

class SubscriptionPlansPage extends StatefulWidget {
  @override
  _SubscriptionPlansPageState createState() => _SubscriptionPlansPageState();
}

class _SubscriptionPlansPageState extends State<SubscriptionPlansPage> {
  int _selectedPlan = 1;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Subscription Plans'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.info),
            onPressed: () {
              // Show subscription info
            },
          ),
        ],
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Choose a Plan',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            Text(
              'Unlock premium features and benefits',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 24),
            Expanded(
              child: ListView.builder(
                itemCount: 3,
                itemBuilder: (context, index) {
                  String title;
                  String price;
                  String period;
                  List<String> features;
                  bool isPopular = index == 1;
                  
                  switch (index) {
                    case 0:
                      title = 'Basic';
                      price = '\$4.99';
                      period = 'per month';
                      features = [
                        'Standard content access',
                        'Basic analytics',
                        '5GB storage',
                        'Standard support'
                      ];
                      break;
                    case 1:
                      title = 'Pro';
                      price = '\$9.99';
                      period = 'per month';
                      features = [
                        'All Basic features',
                        'Advanced analytics',
                        'Unlimited storage',
                        'Priority support',
                        'Monetization tools',
                        'Advanced content features'
                      ];
                      break;
                    case 2:
                      title = 'Enterprise';
                      price = '\$19.99';
                      period = 'per month';
                      features = [
                        'All Pro features',
                        'Dedicated account manager',
                        'Custom integrations',
                        'Advanced security',
                        'API access',
                        'Custom branding'
                      ];
                      break;
                    default:
                      title = '';
                      price = '';
                      period = '';
                      features = [];
                  }
                  
                  return Container(
                    margin: EdgeInsets.only(bottom: 16),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: _selectedPlan == index ? Colors.deepPurple : Colors.grey[300]!,
                        width: _selectedPlan == index ? 2 : 1,
                      ),
                      color: Colors.white,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.1),
                          spreadRadius: 1,
                          blurRadius: 5,
                          offset: Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        if (isPopular)
                          Container(
                            width: double.infinity,
                            padding: EdgeInsets.symmetric(vertical: 6),
                            decoration: BoxDecoration(
                              color: Colors.deepPurple,
                              borderRadius: BorderRadius.vertical(
                                top: Radius.circular(12),
                              ),
                            ),
                            child: Text(
                              'MOST POPULAR',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ),
                        Container(
                          padding: EdgeInsets.all(20),
                          child: Column(
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    title,
                                    style: TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  if (!isPopular)
                                    Checkbox(
                                      value: _selectedPlan == index,
                                      onChanged: (bool? value) {
                                        if (value != null && value) {
                                          setState(() {
                                            _selectedPlan = index;
                                          });
                                        }
                                      },
                                    ),
                                ],
                              ),
                              SizedBox(height: 8),
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text(
                                    price,
                                    style: TextStyle(
                                      fontSize: 28,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.deepPurple,
                                    ),
                                  ),
                                  SizedBox(width: 4),
                                  Text(
                                    period,
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: Colors.grey,
                                    ),
                                  ),
                                ],
                              ),
                              SizedBox(height: 16),
                              Column(
                                children: features.map((feature) => Padding(
                                  padding: EdgeInsets.only(bottom: 8),
                                  child: Row(
                                    children: [
                                      Icon(
                                        Icons.check,
                                        color: Colors.green,
                                        size: 16,
                                      ),
                                      SizedBox(width: 8),
                                      Expanded(
                                        child: Text(
                                          feature,
                                          style: TextStyle(
                                            fontSize: 14,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                )).toList(),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          width: double.infinity,
                          padding: EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: _selectedPlan == index ? Colors.deepPurple[50] : Colors.grey[50],
                            borderRadius: BorderRadius.vertical(
                              bottom: Radius.circular(12),
                            ),
                          ),
                          child: ElevatedButton(
                            onPressed: () {
                              setState(() {
                                _selectedPlan = index;
                              });
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: _selectedPlan == index ? Colors.deepPurple : Colors.grey,
                              foregroundColor: Colors.white,
                              padding: EdgeInsets.symmetric(vertical: 12),
                            ),
                            child: Text(
                              _selectedPlan == index ? 'SELECTED' : 'SELECT PLAN',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                },
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
                children: [
                  Row(
                    children: [
                      Icon(Icons.lock, color: Colors.deepPurple),
                      SizedBox(width: 8),
                      Text(
                        'Secure Payment',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 8),
                  Text(
                    'All transactions are encrypted and secure. Payment information is never stored on our servers.',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[700],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}