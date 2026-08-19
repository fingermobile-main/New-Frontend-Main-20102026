import 'package:flutter/material.dart';

class CommunityManagementPage extends StatefulWidget {
  const CommunityManagementPage({super.key});

  @override
  State<CommunityManagementPage> createState() => _CommunityManagementPageState();
}

class _CommunityManagementPageState extends State<CommunityManagementPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<CommunityMember> _members = [];
  List<CommunityReport> _reports = [];
  List<CommunitySetting> _settings = [];
  int _activeTab = 0;

  @override
  void initState() {
    super.initState();
    _loadCommunityData();
  }

  Future<void> _loadCommunityData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));
      
      // Mock community data
      setState(() {
        _members = [
          CommunityMember(
            id: 1,
            name: 'Alex Johnson',
            role: 'Moderator',
            avatar: 'https://via.placeholder.com/150',
            joinDate: DateTime.now().subtract(const Duration(days: 365)),
            posts: 1240,
            status: MemberStatus.active,
          ),
          CommunityMember(
            id: 2,
            name: 'Sarah Williams',
            role: 'Member',
            avatar: 'https://via.placeholder.com/150',
            joinDate: DateTime.now().subtract(const Duration(days: 120)),
            posts: 85,
            status: MemberStatus.active,
          ),
          CommunityMember(
            id: 3,
            name: 'Mike Chen',
            role: 'Member',
            avatar: 'https://via.placeholder.com/150',
            joinDate: DateTime.now().subtract(const Duration(days: 45)),
            posts: 22,
            status: MemberStatus.warned,
          ),
          CommunityMember(
            id: 4,
            name: 'Emma Rodriguez',
            role: 'Admin',
            avatar: 'https://via.placeholder.com/150',
            joinDate: DateTime.now().subtract(const Duration(days: 500)),
            posts: 2100,
            status: MemberStatus.active,
          ),
        ];
        
        _reports = [
          CommunityReport(
            id: 1,
            reporter: 'Anonymous',
            reportedmember: 'Troublemaker123',
            reason: 'Harassment',
            description: 'member is harassing other members in chat',
            date: DateTime.now().subtract(const Duration(hours: 2)),
            status: ReportStatus.pending,
          ),
          CommunityReport(
            id: 2,
            reporter: 'member456',
            reportedmember: 'Spammer789',
            reason: 'Spam',
            description: 'Posting promotional content repeatedly',
            date: DateTime.now().subtract(const Duration(days: 1)),
            status: ReportStatus.resolved,
          ),
          CommunityReport(
            id: 3,
            reporter: 'ModeratorAlex',
            reportedmember: 'Offensivemember',
            reason: 'Inappropriate Content',
            description: 'Sharing explicit images in public chat',
            date: DateTime.now().subtract(const Duration(days: 3)),
            status: ReportStatus.investigating,
          ),
        ];
        
        _settings = [
          CommunitySetting(
            id: 1,
            name: 'Membership Approval',
            description: 'Require approval for new members',
            enabled: true,
            type: SettingType.toggle,
          ),
          CommunitySetting(
            id: 2,
            name: 'Post Moderation',
            description: 'Moderate posts before publishing',
            enabled: false,
            type: SettingType.toggle,
          ),
          CommunitySetting(
            id: 3,
            name: 'Minimum Posts to Join',
            description: 'Minimum posts required to join community',
            value: '10',
            type: SettingType.number,
          ),
          CommunitySetting(
            id: 4,
            name: 'Welcome Message',
            description: 'Message shown to new members',
            value: 'Welcome to our community!',
            type: SettingType.text,
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load community data. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _banmember(int memberId) {
    setState(() {
      var member = _members.firstWhere((m) => m.id == memberId);
      member.status = MemberStatus.banned;
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('member has been banned'),
        backgroundColor: Colors.red,
      ),
    );
  }

  void _warnmember(int memberId) {
    setState(() {
      var member = _members.firstWhere((m) => m.id == memberId);
      member.status = MemberStatus.warned;
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('member has been warned'),
        backgroundColor: Colors.orange,
      ),
    );
  }

  void _resolveReport(int reportId) {
    setState(() {
      var report = _reports.firstWhere((r) => r.id == reportId);
      report.status = ReportStatus.resolved;
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Report marked as resolved'),
        backgroundColor: Colors.green,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Community Management'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadCommunityData,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadCommunityData,
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
                          onPressed: _loadCommunityData,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : Column(
                    children: [
                      // Tab Bar
                      Container(
                        color: Colors.grey.shade100,
                        child: Row(
                          children: [
                            _buildTab('Members', 0),
                            _buildTab('Reports', 1),
                            _buildTab('Settings', 2),
                          ],
                        ),
                      ),
                      // Tab Content
                      Expanded(
                        child: IndexedStack(
                          index: _activeTab,
                          children: [
                            _buildMembersTab(),
                            _buildReportsTab(),
                            _buildSettingsTab(),
                          ],
                        ),
                      ),
                    ],
                  ),
      ),
    );
  }

  Widget _buildTab(String title, int index) {
    bool isActive = _activeTab == index;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            _activeTab = index;
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

  Widget _buildMembersTab() {
    return ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemCount: _members.length,
      itemBuilder: (context, index) {
        var member = _members[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 16),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    CircleAvatar(
                      backgroundImage: NetworkImage(member.avatar),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            member.name,
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 18,
                            ),
                          ),
                          Text(
                            '${member.role} • Joined ${_formatDate(member.joinDate)}',
                            style: const TextStyle(
                              color: Colors.grey,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: _getStatusColor(member.status),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        _getStatusText(member.status),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('${member.posts} posts'),
                    Row(
                      children: [
                        if (member.status != MemberStatus.banned)
                          IconButton(
                            icon: const Icon(Icons.warning, color: Colors.orange),
                            onPressed: () => _warnmember(member.id),
                          ),
                        if (member.status != MemberStatus.banned)
                          IconButton(
                            icon: const Icon(Icons.block, color: Colors.red),
                            onPressed: () => _banmember(member.id),
                          ),
                        IconButton(
                          icon: const Icon(Icons.message, color: Colors.blue),
                          onPressed: () {
                            // Send message to member
                          },
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildReportsTab() {
    return ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemCount: _reports.length,
      itemBuilder: (context, index) {
        var report = _reports[index];
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
                      'Report #${report.id}',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: _getReportStatusColor(report.status),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        _getReportStatusText(report.status),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  'Reported member: ${report.reportedmember}',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text('Reason: ${report.reason}'),
                const SizedBox(height: 8),
                Text(
                  report.description,
                  style: const TextStyle(
                    fontStyle: FontStyle.italic,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Reported by: ${report.reporter}',
                  style: const TextStyle(
                    fontSize: 12,
                    color: Colors.grey,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Date: ${_formatDateTime(report.date)}',
                  style: const TextStyle(
                    fontSize: 12,
                    color: Colors.grey,
                  ),
                ),
                const SizedBox(height: 16),
                if (report.status == ReportStatus.pending)
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      ElevatedButton(
                        onPressed: () => _resolveReport(report.id),
                        child: const Text('Mark Resolved'),
                      ),
                    ],
                  ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildSettingsTab() {
    return ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemCount: _settings.length,
      itemBuilder: (context, index) {
        var setting = _settings[index];
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
                      setting.name,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    if (setting.type == SettingType.toggle)
                      Switch(
                        value: setting.enabled,
                        onChanged: (value) {
                          setState(() {
                            setting.enabled = value;
                          });
                        },
                      ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  setting.description,
                  style: const TextStyle(
                    color: Colors.grey,
                  ),
                ),
                if (setting.type == SettingType.number || setting.type == SettingType.text)
                  Padding(
                    padding: const EdgeInsets.only(top: 16.0),
                    child: TextField(
                      decoration: InputDecoration(
                        border: const OutlineInputBorder(),
                        hintText: setting.value,
                      ),
                      onChanged: (value) {
                        setState(() {
                          setting.value = value;
                        });
                      },
                    ),
                  ),
              ],
            ),
          ),
        );
      },
    );
  }

  Color _getStatusColor(MemberStatus status) {
    switch (status) {
      case MemberStatus.active:
        return Colors.green;
      case MemberStatus.warned:
        return Colors.orange;
      case MemberStatus.banned:
        return Colors.red;
    }
  }

  String _getStatusText(MemberStatus status) {
    switch (status) {
      case MemberStatus.active:
        return 'Active';
      case MemberStatus.warned:
        return 'Warned';
      case MemberStatus.banned:
        return 'Banned';
    }
  }

  Color _getReportStatusColor(ReportStatus status) {
    switch (status) {
      case ReportStatus.pending:
        return Colors.orange;
      case ReportStatus.investigating:
        return Colors.blue;
      case ReportStatus.resolved:
        return Colors.green;
    }
  }

  String _getReportStatusText(ReportStatus status) {
    switch (status) {
      case ReportStatus.pending:
        return 'Pending';
      case ReportStatus.investigating:
        return 'Investigating';
      case ReportStatus.resolved:
        return 'Resolved';
    }
  }

  String _formatDate(DateTime date) {
    return '${date.month}/${date.day}/${date.year}';
  }

  String _formatDateTime(DateTime date) {
    return '${date.month}/${date.day}/${date.year} ${date.hour}:${date.minute}';
  }
}

enum MemberStatus { active, warned, banned }
enum ReportStatus { pending, investigating, resolved }
enum SettingType { toggle, number, text }

class CommunityMember {
  final int id;
  final String name;
  final String role;
  final String avatar;
  final DateTime joinDate;
  final int posts;
  MemberStatus status;

  CommunityMember({
    required this.id,
    required this.name,
    required this.role,
    required this.avatar,
    required this.joinDate,
    required this.posts,
    required this.status,
  });
}

class CommunityReport {
  final int id;
  final String reporter;
  final String reportedmember;
  final String reason;
  final String description;
  final DateTime date;
  ReportStatus status;

  CommunityReport({
    required this.id,
    required this.reporter,
    required this.reportedmember,
    required this.reason,
    required this.description,
    required this.date,
    required this.status,
  });
}

class CommunitySetting {
  final int id;
  final String name;
  final String description;
  bool enabled;
  String value;
  final SettingType type;

  CommunitySetting({
    required this.id,
    required this.name,
    required this.description,
    this.enabled = false,
    this.value = '',
    required this.type,
  });
}