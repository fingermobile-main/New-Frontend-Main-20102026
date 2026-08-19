import 'package:flutter/material.dart';

class RbacManagementPage extends StatefulWidget {
  const RbacManagementPage({super.key});

  @override
  State<RbacManagementPage> createState() => _RbacManagementPageState();
}

class _RbacManagementPageState extends State<RbacManagementPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<Role> _roles = [];
  List<Permission> _permissions = [];
  List<Member> _members = [];
  int _activeTab = 0;

  @override
  void initState() {
    super.initState();
    _loadRbacData();
  }

  Future<void> _loadRbacData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock roles
      setState(() {
        _roles = [
          Role(
            id: 1,
            name: 'Administrator',
            description: 'Full system access with all permissions',
            memberCount: 5,
            permissionCount: 25,
            createdAt: DateTime.now().subtract(const Duration(days: 365)),
            isSystemRole: true,
          ),
          Role(
            id: 2,
            name: 'Moderator',
            description: 'Can manage content and members',
            memberCount: 12,
            permissionCount: 18,
            createdAt: DateTime.now().subtract(const Duration(days: 180)),
            isSystemRole: true,
          ),
          Role(
            id: 3,
            name: 'Content Creator',
            description: 'Can create and manage own content',
            memberCount: 42,
            permissionCount: 12,
            createdAt: DateTime.now().subtract(const Duration(days: 90)),
            isSystemRole: false,
          ),
          Role(
            id: 4,
            name: 'Standard member',
            description: 'Basic member with limited permissions',
            memberCount: 1250,
            permissionCount: 8,
            createdAt: DateTime.now().subtract(const Duration(days: 730)),
            isSystemRole: true,
          ),
          Role(
            id: 5,
            name: 'Premium member',
            description: 'Enhanced features for paying members',
            memberCount: 210,
            permissionCount: 15,
            createdAt: DateTime.now().subtract(const Duration(days: 60)),
            isSystemRole: false,
          ),
        ];

        // Mock permissions
        _permissions = [
          Permission(
            id: 1,
            name: 'manage_members',
            description: 'Can create, edit, and delete members',
            category: 'member Management',
          ),
          Permission(
            id: 2,
            name: 'manage_roles',
            description: 'Can create, edit, and delete roles',
            category: 'member Management',
          ),
          Permission(
            id: 3,
            name: 'manage_content',
            description: 'Can create, edit, and delete content',
            category: 'Content Management',
          ),
          Permission(
            id: 4,
            name: 'manage_payments',
            description: 'Can view and manage payments',
            category: 'Financial Management',
          ),
          Permission(
            id: 5,
            name: 'view_analytics',
            description: 'Can view system analytics and reports',
            category: 'Analytics',
          ),
          Permission(
            id: 6,
            name: 'manage_settings',
            description: 'Can modify system settings',
            category: 'System Management',
          ),
        ];

        // Mock members
        _members = [
          member(
            id: 1,
            name: 'John Admin',
            email: 'john.admin@example.com',
            role: 'Administrator',
            status: MemberStatus.active,
            lastLogin: DateTime.now().subtract(const Duration(hours: 2)),
            avatarUrl: 'https://via.placeholder.com/50x50/4ECDC4/FFFFFF?text=JA',
          ),
          member(
            id: 2,
            name: 'Sarah Moderator',
            email: 'sarah.mod@example.com',
            role: 'Moderator',
            status: MemberStatus.active,
            lastLogin: DateTime.now().subtract(const Duration(days: 1)),
            avatarUrl: 'https://via.placeholder.com/50x50/FF6B6B/FFFFFF?text=SM',
          ),
          member(
            id: 3,
            name: 'Mike Creator',
            email: 'mike.creator@example.com',
            role: 'Content Creator',
            status: MemberStatus.active,
            lastLogin: DateTime.now().subtract(const Duration(days: 3)),
            avatarUrl: 'https://via.placeholder.com/50x50/45B7D1/FFFFFF?text=MC',
          ),
          member(
            id: 4,
            name: 'Lisa member',
            email: 'lisa.member@example.com',
            role: 'Standard member',
            status: MemberStatus.inactive,
            lastLogin: DateTime.now().subtract(const Duration(days: 30)),
            avatarUrl: 'https://via.placeholder.com/50x50/96CEB4/FFFFFF?text=LU',
          ),
          member(
            id: 5,
            name: 'David Premium',
            email: 'david.premium@example.com',
            role: 'Premium member',
            status: MemberStatus.suspended,
            lastLogin: DateTime.now().subtract(const Duration(days: 7)),
            avatarUrl: 'https://via.placeholder.com/50x50/FFEAA7/000000?text=DP',
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load RBAC data. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _changeTab(int index) {
    setState(() {
      _activeTab = index;
    });
  }

  void _addRole() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Add role functionality would open here'),
        backgroundColor: Colors.blue,
      ),
    );
  }

  void _editRole(Role role) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Editing role: ${role.name}'),
        backgroundColor: Colors.blue,
      ),
    );
  }

  void _deleteRole(Role role) {
    setState(() {
      _roles.removeWhere((r) => r.id == role.id);
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Deleted role: ${role.name}'),
        backgroundColor: Colors.red,
      ),
    );
  }

  void _assignRole(Member member) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.0)),
      ),
      builder: (context) => _buildAssignRoleSheet(member),
    );
  }

  Widget _buildAssignRoleSheet(Member member) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Assign Role to ${member.name}',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            'Current role: ${member.role}',
            style: const TextStyle(
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'Select new role:',
            style: TextStyle(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          SizedBox(
            height: 200,
            child: ListView.builder(
              itemCount: _roles.length,
              itemBuilder: (context, index) {
                var role = _roles[index];
                return ListTile(
                  title: Text(role.name),
                  subtitle: Text(role.description),
                  trailing: Icon(
                    member.role == role.name ? Icons.check_circle : Icons.circle_outlined,
                    color: member.role == role.name ? Colors.green : null,
                  ),
                  onTap: () {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Assigned role ${role.name} to ${member.name}'),
                        backgroundColor: Colors.green,
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('RBAC Management'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadRbacData,
          ),
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              // Show settings
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadRbacData,
        child: _isLoading && (_roles.isEmpty || _permissions.isEmpty || _members.isEmpty)
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null &&
                    (_roles.isEmpty || _permissions.isEmpty || _members.isEmpty)
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadRbacData,
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
                        // Stats Summary
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              children: [
                                _buildStatItem('Roles', '${_roles.length}'),
                                _buildStatItem('Permissions', '${_permissions.length}'),
                                _buildStatItem('members', '${_members.length}'),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
                        // Tabs
                        Container(
                          height: 50,
                          decoration: BoxDecoration(
                            color: Colors.grey.shade100,
                            borderRadius: BorderRadius.circular(25),
                          ),
                          child: Row(
                            children: [
                              _buildTab('Roles', 0),
                              _buildTab('Permissions', 1),
                              _buildTab('members', 2),
                            ],
                          ),
                        ),
                        const SizedBox(height: 24),
                        // Content based on active tab
                        Expanded(
                          child: _activeTab == 0
                              ? _buildRolesTab()
                              : _activeTab == 1
                                  ? _buildPermissionsTab()
                                  : _buildmembersTab(),
                        ),
                      ],
                    ),
                  ),
      ),
      floatingActionButton: _activeTab == 0
          ? FloatingActionButton(
              backgroundColor: Theme.of(context).primaryColor,
              child: const Icon(Icons.add),
              onPressed: _addRole,
            )
          : null,
    );
  }

  Widget _buildRolesTab() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'System Roles',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
            ),
            TextButton.icon(
              onPressed: () {
                // Filter roles
              },
              icon: const Icon(Icons.filter_list),
              label: const Text('Filter'),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Expanded(
          child: ListView.builder(
            itemCount: _roles.length,
            itemBuilder: (context, index) {
              var role = _roles[index];
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
                            role.name,
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 18,
                            ),
                          ),
                          if (role.isSystemRole)
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.blue,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Text(
                                'System',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        role.description,
                        style: const TextStyle(
                          color: Colors.grey,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _buildRoleStatItem('members', '${role.memberCount}'),
                          _buildRoleStatItem('Permissions', '${role.permissionCount}'),
                          _buildRoleStatItem(
                              'Created', '${_formatDate(role.createdAt)}'),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          TextButton.icon(
                            onPressed: () => _editRole(role),
                            icon: const Icon(Icons.edit),
                            label: const Text('Edit'),
                          ),
                          const SizedBox(width: 8),
                          if (!role.isSystemRole)
                            TextButton.icon(
                              onPressed: () => _deleteRole(role),
                              icon: const Icon(Icons.delete),
                              label: const Text('Delete'),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildPermissionsTab() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Available Permissions',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        const SizedBox(height: 16),
        Expanded(
          child: ListView.builder(
            itemCount: _permissions.length,
            itemBuilder: (context, index) {
              var permission = _permissions[index];
              return Card(
                margin: const EdgeInsets.only(bottom: 16),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        permission.name,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        permission.description,
                        style: const TextStyle(
                          color: Colors.grey,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade200,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          permission.category,
                          style: const TextStyle(
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildmembersTab() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'member Management',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
            ),
            TextButton.icon(
              onPressed: () {
                // Search members
              },
              icon: const Icon(Icons.search),
              label: const Text('Search'),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Expanded(
          child: ListView.builder(
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
                            radius: 25,
                            backgroundImage: NetworkImage(member.avatarUrl),
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
                                Text(member.email),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: _getmemberStatusColor(member.status),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              _getmemberStatusText(member.status),
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
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Role',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey,
                                ),
                              ),
                              Text(member.role),
                            ],
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              const Text(
                                'Last Login',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey,
                                ),
                              ),
                              Text(_formatRelativeTime(member.lastLogin)),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          TextButton.icon(
                            onPressed: () => _assignRole(member),
                            icon: const Icon(Icons.assignment),
                            label: const Text('Assign Role'),
                          ),
                          const SizedBox(width: 8),
                          TextButton.icon(
                            onPressed: () {
                              // View member details
                            },
                            icon: const Icon(Icons.visibility),
                            label: const Text('View'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            color: Colors.grey,
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  Widget _buildRoleStatItem(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            color: Colors.grey,
            fontSize: 12,
          ),
        ),
      ],
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
          decoration: BoxDecoration(
            color: isActive ? Theme.of(context).primaryColor : Colors.transparent,
            borderRadius: BorderRadius.circular(25),
          ),
          child: Center(
            child: Text(
              title,
              style: TextStyle(
                fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                color: isActive ? Colors.white : Colors.grey,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Color _getmemberStatusColor(memberStatus status) {
    switch (status) {
      case memberStatus.active:
        return Colors.green;
      case memberStatus.inactive:
        return Colors.grey;
      case memberStatus.suspended:
        return Colors.red;
    }
  }

  String _getmemberStatusText(memberStatus status) {
    switch (status) {
      case memberStatus.active:
        return 'Active';
      case memberStatus.inactive:
        return 'Inactive';
      case memberStatus.suspended:
        return 'Suspended';
    }
  }

  String _formatDate(DateTime date) {
    return '${date.month}/${date.day}/${date.year}';
  }

  String _formatRelativeTime(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes} min ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours} hrs ago';
    } else if (difference.inDays < 7) {
      return '${difference.inDays} days ago';
    } else {
      return '${dateTime.month}/${dateTime.day}/${dateTime.year}';
    }
  }
}

enum memberStatus { active, inactive, suspended }

class Role {
  final int id;
  final String name;
  final String description;
  final int memberCount;
  final int permissionCount;
  final DateTime createdAt;
  final bool isSystemRole;

  Role({
    required this.id,
    required this.name,
    required this.description,
    required this.memberCount,
    required this.permissionCount,
    required this.createdAt,
    required this.isSystemRole,
  });
}

class Permission {
  final int id;
  final String name;
  final String description;
  final String category;

  Permission({
    required this.id,
    required this.name,
    required this.description,
    required this.category,
  });
}

class member {
  final int id;
  final String name;
  final String email;
  final String role;
  final memberStatus status;
  final DateTime lastLogin;
  final String avatarUrl;

  member({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    required this.status,
    required this.lastLogin,
    required this.avatarUrl,
  });
}