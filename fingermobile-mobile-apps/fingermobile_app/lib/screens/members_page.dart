import 'package:flutter/material.dart';

class MembersPage extends StatefulWidget {
  const MembersPage({super.key});

  @override
  State<MembersPage> createState() => _MembersPageState();
}

class _MembersPageState extends State<MembersPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<Member> _members = [];
  List<Member> _filteredMembers = [];
  String _searchQuery = '';
  String _filter = 'all';
  Map<String, dynamic> _analyticsData = {};

  @override
  void initState() {
    super.initState();
    _loadMembers();
  }

  Future<void> _loadMembers() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock member data
      setState(() {
        _members = [
          Member(
            id: 1,
            name: 'Alex Johnson',
            membername: 'alexj123',
            avatarUrl: 'https://via.placeholder.com/150/4ECDC4/FFFFFF?text=AJ',
            role: 'Standard Member',
            lastActive: DateTime.now().subtract(const Duration(minutes: 25)),
            status: MemberStatus.active,
            engagementScore: 88,
            memberSince: DateTime.now().subtract(const Duration(days: 450)),
            organization: 'Tech Innovators Inc.',
            jobTitle: 'Senior Product Manager',
            location: 'New York, NY',
            interests: ['Technology', 'Networking', 'Personal Development'],
          ),
          Member(
            id: 2,
            name: 'Sarah Williams',
            membername: 'sarahw456',
            avatarUrl: 'https://via.placeholder.com/150/FF6B6B/FFFFFF?text=SW',
            role: 'Premium Member',
            lastActive: DateTime.now().subtract(const Duration(days: 2)),
            status: MemberStatus.active,
            engagementScore: 92,
            memberSince: DateTime.now().subtract(const Duration(days: 730)),
            organization: 'Creative Solutions LLC',
            jobTitle: 'Marketing Director',
            location: 'Los Angeles, CA',
            interests: ['Marketing', 'Design', 'Content Creation'],
          ),
          Member(
            id: 3,
            name: 'Mike Chen',
            membername: 'mikec789',
            avatarUrl: 'https://via.placeholder.com/150/118AB2/FFFFFF?text=MC',
            role: 'Standard Member',
            lastActive: DateTime.now().subtract(const Duration(days: 5)),
            status: MemberStatus.inactive,
            engagementScore: 65,
            memberSince: DateTime.now().subtract(const Duration(days: 120)),
            organization: 'Data Analytics Group',
            jobTitle: 'Data Scientist',
            location: 'Chicago, IL',
            interests: ['Data Science', 'Machine Learning', 'Analytics'],
          ),
          Member(
            id: 4,
            name: 'Emma Davis',
            membername: 'emmad789',
            avatarUrl: 'https://via.placeholder.com/150/98FB98/FFFFFF?text=ED',
            role: 'Premium Member',
            lastActive: DateTime.now().subtract(const Duration(days: 1)),
            status: MemberStatus.active,
            engagementScore: 82,
            memberSince: DateTime.now().subtract(const Duration(days: 300)),
            organization: 'Digital Marketing Co.',
            jobTitle: 'Social Media Manager',
            location: 'San Francisco, CA',
            interests: ['Social Media', 'Marketing', 'Photography'],
          ),
          Member(
            id: 5,
            name: 'David Wilson',
            membername: 'davidw123',
            avatarUrl: 'https://via.placeholder.com/150/6A0572/FFFFFF?text=DW',
            role: 'Standard Member',
            lastActive: DateTime.now().subtract(const Duration(days: 3)),
            status: MemberStatus.suspended,
            engagementScore: 45,
            memberSince: DateTime.now().subtract(const Duration(days: 90)),
            organization: 'FinTech Solutions',
            jobTitle: 'Financial Analyst',
            location: 'Boston, MA',
            interests: ['Finance', 'Blockchain', 'Data Analysis'],
          ),
        ];

        _filteredMembers = _members;

        // Mock analytics data
        _analyticsData = {
          'totalMembers': _members.length,
          'activeMembers': _members.where((m) => m.status == MemberStatus.active).length,
          'premiumMembers': _members.where((m) => m.role.contains('Premium')).length,
          'engagement': {
            'high': _members.where((m) => m.engagementScore >= 80).length,
            'medium': _members.where((m) => m.engagementScore >= 50 && m.engagementScore < 80).length,
            'low': _members.where((m) => m.engagementScore < 50).length,
          },
          'memberGrowth': {
            'thisMonth': 15,
            'lastMonth': 12,
            'growthPercentage': 25.0,
          },
        };
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load members. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _filterMembers(String filter) {
    setState(() {
      _filter = filter;
      
      if (filter == 'all') {
        _filteredMembers = _members;
      } else if (filter == 'active') {
        _filteredMembers = _members.where((m) => m.status == MemberStatus.active).toList();
      } else if (filter == 'premium') {
        _filteredMembers = _members.where((m) => m.role.contains('Premium')).toList();
      } else if (filter == 'suspended') {
        _filteredMembers = _members.where((m) => m.status == MemberStatus.suspended).toList();
      } else if (filter == 'inactive') {
        _filteredMembers = _members.where((m) => m.status == MemberStatus.inactive).toList();
      }
    });
  }

  void _searchMembers(String query) {
    setState(() {
      _searchQuery = query;
      
      if (query.isEmpty) {
        _filteredMembers = _members;
      } else {
        _filteredMembers = _members.where((m) => 
          m.name.toLowerCase().contains(query.toLowerCase()) || 
          m.membername.toLowerCase().contains(query.toLowerCase()) ||
          (m.organization != null ? m.organization!.toLowerCase().contains(query.toLowerCase()) : false)
        ).toList();
      }
    });
  }

  void _changeMemberStatus(int memberId, MemberStatus newStatus) {
    setState(() {
      _members = _members.map((member) {
        if (member.id == memberId) {
          return Member(
            id: member.id,
            name: member.name,
            membername: handlename,
            avatarUrl: member.avatarUrl,
            role: member.role,
            lastActive: member.lastActive,
            status: newStatus,
            engagementScore: member.engagementScore,
            memberSince: handleSince,
            organization: member.organization,
            jobTitle: member.jobTitle,
            location: member.location,
            interests: member.interests,
          );
        }
        return member;
      }).toList();
      
      _filterMembers(_filter);
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Member status updated to $newStatus'),
        backgroundColor: Theme.of(context).primaryColor,
      ),
    );
  }

  void _promoteToPremium(int memberId) {
    setState(() {
      _members = _members.map((member) {
        if (member.id == memberId) {
          return Member(
            id: member.id,
            name: member.name,
            membername: handlename,
            avatarUrl: member.avatarUrl,
            role: 'Premium Member',
            lastActive: member.lastActive,
            status: member.status,
            engagementScore: member.engagementScore,
            memberSince: handleSince,
            organization: member.organization,
            jobTitle: member.jobTitle,
            location: member.location,
            interests: member.interests,
          );
        }
        return member;
      }).toList();
      
      _filterMembers(_filter);
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Member promoted to Premium'),
        backgroundColor: Colors.orange,
      ),
    );
  }

  void _showMemberDetails(Member member) {
    // Show member details in a bottom sheet
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.0)),
      ),
      builder: (context) => _buildMemberDetailsSheet(member),
    );
  }

  Widget _buildMemberDetailsSheet(Member member) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                member.name,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: member.role.contains('Premium') 
                    ? Colors.orange.shade200 
                    : Colors.grey.shade200,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  member.role,
                  style: TextStyle(
                    color: member.role.contains('Premium') 
                      ? Colors.orange 
                      : Colors.grey,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Icon(
                Icons.calendar_today,
                color: Colors.grey[600],
                size: 16,
              ),
              const SizedBox(width: 8),
              Text(
                'Member since ${_formatDate(handleSince)}',
                style: const TextStyle(
                  fontSize: 14,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Icon(
                Icons.location_on,
                color: Colors.grey[600],
                size: 16,
              ),
              const SizedBox(width: 8),
              Text(
                member.location,
                style: const TextStyle(
                  fontSize: 14,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Icon(
                Icons.work,
                color: Colors.grey[600],
                size: 16,
              ),
              const SizedBox(width: 8),
              Text(
                '${member.jobTitle} at ${member.organization}',
                style: const TextStyle(
                  fontSize: 14,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            'Engagement Score: ${member.engagementScore}',
            style: TextStyle(
              color: _getEngagementColor(member.engagementScore),
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          LinearProgressIndicator(
            value: member.engagementScore / 100,
            color: _getEngagementColor(member.engagementScore),
            backgroundColor: Colors.grey.shade300,
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8,
            children: member.interests.map((interest) => Chip(
              label: Text(interest),
              backgroundColor: Colors.grey.shade200,
            )).toList(),
          ),
          const SizedBox(height: 16),
          if (member.status == MemberStatus.suspended)
            ElevatedButton.icon(
              onPressed: () => _changeMemberStatus(member.id, MemberStatus.active),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                foregroundColor: Colors.white,
              ),
              icon: const Icon(Icons.check_circle),
              label: const Text('Reactivate Member'),
            ),
          if (member.status != MemberStatus.suspended && member.role.contains('Standard'))
            ElevatedButton.icon(
              onPressed: () => _promoteToPremium(member.id),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.orange,
                foregroundColor: Colors.white,
              ),
              icon: const Icon(Icons.workspace_premium),
              label: const Text('Promote to Premium'),
            ),
          const SizedBox(height: 16),
          ElevatedButton.icon(
            onPressed: () {
              // Send message to member
              Navigator.pushNamed(context, '/messages/new', arguments: {'member': member});
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue,
              foregroundColor: Colors.white,
            ),
            icon: const Icon(Icons.message),
            label: const Text('Send Message'),
          ),
          const SizedBox(height: 16),
          ElevatedButton.icon(
            onPressed: () {
              // View member activity
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.purple,
              foregroundColor: Colors.white,
            ),
            icon: const Icon(Icons.analytics),
            label: const Text('View Activity'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Member Management'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              // Add new member
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Add member functionality would open here'),
                  backgroundColor: Colors.blue,
                ),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadMembers,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadMembers,
        child: _isLoading && _members.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _members.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadMembers,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Analytics Summary
                        Card(
                          color: Colors.blue.shade50,
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    _buildAnalyticsItem('Total', _analyticsData['totalMembers'].toString(), Colors.blue),
                                    _buildAnalyticsItem('Active', _analyticsData['activeMembers'].toString(), Colors.green),
                                    _buildAnalyticsItem('Premium', _analyticsData['premiumMembers'].toString(), Colors.orange),
                                    _buildAnalyticsItem('Suspended', _analyticsData['engagement']['low'].toString(), Colors.red),
                                  ],
                                ),
                                const SizedBox(height: 16),
                                // Engagement Summary
                                const Text(
                                  'Engagement Summary',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    _buildEngagementBarItem('High', _analyticsData['engagement']['high'], Colors.green),
                                    const SizedBox(width: 8),
                                    _buildEngagementBarItem('Medium', _analyticsData['engagement']['medium'], Colors.orange),
                                    const SizedBox(width: 8),
                                    _buildEngagementBarItem('Low', _analyticsData['engagement']['low'], Colors.red),
                                  ],
                                ),
                                const SizedBox(height: 16),
                                // Member Growth
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      'Member Growth: ${_analyticsData['memberGrowth']['growthPercentage']}% this month',
                                      style: const TextStyle(
                                        fontSize: 14,
                                      ),
                                    ),
                                    Text(
                                      '+${_analyticsData['memberGrowth']['thisMonth']} this month',
                                      style: const TextStyle(
                                        fontSize: 14,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
                        // Filter and Search
                        Row(
                          children: [
                            Expanded(
                              child: TextField(
                                decoration: const InputDecoration(
                                  hintText: 'Search members...',
                                  prefixIcon: Icon(Icons.search),
                                  border: OutlineInputBorder(),
                                ),
                                onChanged: _searchMembers,
                              ),
                            ),
                            const SizedBox(width: 12),
                            PopupMenuButton<String>(
                              icon: const Icon(Icons.filter_list),
                              onSelected: _filterMembers,
                              itemBuilder: (context) => [
                                const PopupMenuItem(
                                  value: 'all',
                                  child: Text('All Members'),
                                ),
                                const PopupMenuItem(
                                  value: 'active',
                                  child: Text('Active Members'),
                                ),
                                const PopupMenuItem(
                                  value: 'premium',
                                  child: Text('Premium Members'),
                                ),
                                const PopupMenuItem(
                                  value: 'suspended',
                                  child: Text('Suspended Members'),
                                ),
                                const PopupMenuItem(
                                  value: 'inactive',
                                  child: Text('Inactive Members'),
                                ),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        // Members List
                        Expanded(
                          child: ListView.builder(
                            itemCount: _filteredMembers.length,
                            itemBuilder: (context, index) {
                              var member = _filteredMembers[index];
                              return Card(
                                margin: const EdgeInsets.only(bottom: 12),
                                child: ListTile(
                                  leading: CircleAvatar(
                                    radius: 25,
                                    backgroundImage: NetworkImage(member.avatarUrl),
                                  ),
                                  title: Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(member.name),
                                      Container(
                                        padding: const EdgeInsets.symmetric(
                                          horizontal: 12,
                                          vertical: 4,
                                        ),
                                        decoration: BoxDecoration(
                                          color: member.status == MemberStatus.active 
                                              ? Colors.green.shade100 
                                              : member.status == MemberStatus.suspended 
                                                  ? Colors.red.shade100 
                                                  : Colors.orange.shade100,
                                          borderRadius: BorderRadius.circular(12),
                                        ),
                                        child: Text(
                                          member.status.toString().split('.')[1],
                                          style: TextStyle(
                                            color: member.status == MemberStatus.active 
                                                ? Colors.green[800] 
                                                : member.status == MemberStatus.suspended 
                                                    ? Colors.red[800] 
                                                    : Colors.orange[800],
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  subtitle: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const SizedBox(height: 4),
                                      Text('${member.jobTitle} at ${member.organization}'),
                                      const SizedBox(height: 4),
                                      Row(
                                        children: [
                                          Icon(
                                            Icons.location_on,
                                            size: 16,
                                            color: Colors.grey[600],
                                          ),
                                          const SizedBox(width: 4),
                                          Text(member.location),
                                          const SizedBox(width: 12),
                                          Icon(
                                            Icons.calendar_today,
                                            size: 16,
                                            color: Colors.grey[600],
                                          ),
                                          const SizedBox(width: 4),
                                          Text(_formatDate(handleSince)),
                                        ],
                                      ),
                                    ],
                                  ),
                                  trailing: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text(
                                        '${member.engagementScore} Engagement',
                                        style: TextStyle(
                                          color: _getEngagementColor(member.engagementScore),
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      if (member.role.contains('Premium'))
                                        Icon(
                                          Icons.workspace_premium,
                                          color: Colors.orange,
                                          size: 20,
                                        ),
                                    ],
                                  ),
                                  onTap: () => _showMemberDetails(member),
                                ),
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Theme.of(context).primaryColor,
        child: const Icon(Icons.add),
        onPressed: () {
          // Add new member
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Add member functionality would open here'),
              backgroundColor: Colors.blue,
            ),
          );
        },
      ),
    );
  }

  Widget _buildAnalyticsItem(String label, String value, Color color) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            color: Colors.grey,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
      ],
    );
  }

  Widget _buildEngagementBarItem(String label, int value, Color color) {
    double maxValue = _analyticsData['engagement'].values.reduce((a, b) => a > b ? a : b).toDouble();
    double barHeight = (value / maxValue) * 20;
    
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 20,
                height: barHeight,
                color: color,
              ),
              const SizedBox(width: 4),
              Text('$value'),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  Color _getEngagementColor(int score) {
    if (score >= 80) return Colors.green;
    if (score >= 60) return Colors.orange;
    return Colors.red;
  }

  String _formatDate(DateTime date) {
    return '${date.month}/${date.day}/${date.year}';
  }
}

enum MemberStatus { active, inactive, suspended }

class Member {
  final int id;
  final String name;
  final String membername;
  final String avatarUrl;
  final String role;
  final DateTime lastActive;
  final MemberStatus status;
  final int engagementScore;
  final DateTime memberSince;
  final String? organization;
  final String? jobTitle;
  final String location;
  final List<String> interests;

  Member({
    required this.id,
    required this.name,
    required this.membername,
    required this.avatarUrl,
    required this.role,
    required this.lastActive,
    required this.status,
    required this.engagementScore,
    required this.memberSince,
    this.organization,
    this.jobTitle,
    required this.location,
    required this.interests,
  });
}