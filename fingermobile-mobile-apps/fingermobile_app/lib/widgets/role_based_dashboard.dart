import 'package:flutter/material.dart';
import 'package:fingermobile_app/widgets\dashboard_layout.dart';

class RoleBasedDashboard extends StatefulWidget {
  final String userRole;

  const RoleBasedDashboard({Key? key, required this.userRole}) : super(key: key);

  @override
  _RoleBasedDashboardState createState() => _RoleBasedDashboardState();
}

class _RoleBasedDashboardState extends State<RoleBasedDashboard> {
  @override
  Widget build(BuildContext context) {
    return DashboardLayout(
      title: '${_getTitleForRole(widget.userRole)} Dashboard',
      child: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header section
              Container(
                padding: EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Colors.blue[600]!, Colors.blue[800]!],
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Welcome, ${_getRoleTitle(widget.userRole)}!',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      _getRoleDescription(widget.userRole),
                      style: TextStyle(
                        color: Colors.white70,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
              ),
              
              SizedBox(height: 24),
              
              // Role-specific stats
              Text(
                'Your Metrics',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 16),
              _buildRoleStats(),
              
              SizedBox(height: 24),
              
              // Quick actions
              Text(
                'Quick Actions',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildQuickActions(),
              
              SizedBox(height: 24),
              
              // Recent activity
              Text(
                'Recent Activity',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildActivityList(),
              
              SizedBox(height: 24),
              
              // Resources
              Text(
                'Resources',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildResourceList(),
            ],
          ),
        ),
      ),
    );
  }

  String _getTitleForRole(String role) {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'Admin';
      case 'moderator':
        return 'Moderator';
      case 'creator':
        return 'Creator';
      case 'member':
        return 'Member';
      case 'subscriber':
        return 'Subscriber';
      case 'guest':
        return 'Guest';
      default:
        return 'User';
    }
  }

  String _getRoleTitle(String role) {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'Administrator';
      case 'moderator':
        return 'Moderator';
      case 'creator':
        return 'Creator';
      case 'member':
        return 'Member';
      case 'subscriber':
        return 'Subscriber';
      case 'guest':
        return 'Guest';
      default:
        return 'User';
    }
  }

  String _getRoleDescription(String role) {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'Manage platform settings, user accounts, and overall system performance.';
      case 'moderator':
        return 'Monitor content, manage reports, and maintain community guidelines.';
      case 'creator':
        return 'Create content, engage with your audience, and grow your following.';
      case 'member':
        return 'Interact with content, participate in discussions, and connect with others.';
      case 'subscriber':
        return 'Access premium content and features based on your subscription tier.';
      case 'guest':
        return 'Browse public content and explore platform features.';
      default:
        return 'Access platform features based on your role permissions.';
    }
  }

  Widget _buildRoleStats() {
    List<StatItem> stats = [];
    
    switch (widget.userRole.toLowerCase()) {
      case 'admin':
        stats = [
          StatItem('Total Users', '12,450', Icons.people, Colors.blue),
          StatItem('Active Today', '3,240', Icons.access_time, Colors.green),
          StatItem('Content Items', '45,678', Icons.article, Colors.orange),
          StatItem('Revenue', '\$42,560', Icons.attach_money, Colors.purple),
        ];
        break;
      case 'moderator':
        stats = [
          StatItem('Reviews Completed', '124', Icons.check_circle, Colors.green),
          StatItem('Reports Handled', '87', Icons.flag, Colors.orange),
          StatItem('Content Removed', '12', Icons.delete, Colors.red),
          StatItem('Warnings Issued', '34', Icons.warning, Colors.yellow),
        ];
        break;
      case 'creator':
        stats = [
          StatItem('Total Posts', '86', Icons.article, Colors.blue),
          StatItem('Followers', '1,240', Icons.people, Colors.green),
          StatItem('Engagements', '4,560', Icons.thumb_up, Colors.orange),
          StatItem('Earnings', '\$1,240', Icons.attach_money, Colors.purple),
        ];
        break;
      case 'member':
        stats = [
          StatItem('Posts Liked', '245', Icons.thumb_up, Colors.blue),
          StatItem('Comments', '87', Icons.comment, Colors.green),
          StatItem('Followings', '124', Icons.person_add, Colors.orange),
          StatItem('Watch Time', '42h', Icons.watch_later, Colors.purple),
        ];
        break;
      default:
        stats = [
          StatItem('Total Items', '0', Icons.grid_view, Colors.grey),
          StatItem('Completed Tasks', '0', Icons.check, Colors.grey),
          StatItem('Achievements', '0', Icons.star, Colors.grey),
          StatItem('Points Earned', '0', Icons.monetization_on, Colors.grey),
        ];
    }

    return GridView.count(
      crossAxisCount: 2,
      crossAxisSpacing: 16,
      mainAxisSpacing: 16,
      shrinkWrap: true,
      physics: NeverScrollableScrollPhysics(),
      children: stats.map((stat) => _buildStatCard(stat)).toList(),
    );
  }

  Widget _buildStatCard(StatItem stat) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(stat.icon, color: stat.color),
                SizedBox(width: 8),
                Text(
                  stat.title,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
            SizedBox(height: 8),
            Text(
              stat.value,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActions() {
    List<ActionItem> actions = [];
    
    switch (widget.userRole.toLowerCase()) {
      case 'admin':
        actions = [
          ActionItem('User Management', Icons.people_alt, Colors.blue, () {}),
          ActionItem('System Settings', Icons.settings, Colors.orange, () {}),
          ActionItem('Content Review', Icons.remove_red_eye, Colors.green, () {}),
          ActionItem('Reports', Icons.report, Colors.red, () {}),
        ];
        break;
      case 'moderator':
        actions = [
          ActionItem('Review Queue', Icons.queue, Colors.blue, () {}),
          ActionItem('Content Reports', Icons.flag, Colors.orange, () {}),
          ActionItem('User Appeals', Icons.gavel, Colors.green, () {}),
          ActionItem('Guidelines', Icons.info, Colors.purple, () {}),
        ];
        break;
      case 'creator':
        actions = [
          ActionItem('Create Post', Icons.add, Colors.blue, () {}),
          ActionItem('Analytics', Icons.analytics, Colors.green, () {}),
          ActionItem('Monetization', Icons.attach_money, Colors.orange, () {}),
          ActionItem('Schedule', Icons.schedule, Colors.purple, () {}),
        ];
        break;
      case 'member':
        actions = [
          ActionItem('Discover', Icons.explore, Colors.blue, () {}),
          ActionItem('Notifications', Icons.notifications, Colors.orange, () {}),
          ActionItem('Bookmarks', Icons.bookmark, Colors.green, () {}),
          ActionItem('Profile', Icons.person, Colors.purple, () {}),
        ];
        break;
      default:
        actions = [
          ActionItem('Dashboard', Icons.dashboard, Colors.grey, () {}),
          ActionItem('Settings', Icons.settings, Colors.grey, () {}),
          ActionItem('Help', Icons.help, Colors.grey, () {}),
          ActionItem('Feedback', Icons.feedback, Colors.grey, () {}),
        ];
    }

    return Wrap(
      spacing: 12,
      runSpacing: 12,
      children: actions.map((action) => _buildActionCard(action)).toList(),
    );
  }

  Widget _buildActionCard(ActionItem action) {
    return Expanded(
      child: Card(
        child: InkWell(
          onTap: action.onPressed,
          child: Container(
            width: 120,
            padding: EdgeInsets.all(16),
            child: Column(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: action.color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(action.icon, color: action.color),
                ),
                SizedBox(height: 8),
                Text(
                  action.title,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildActivityList() {
    List<ActivityItem> activities = [];
    
    switch (widget.userRole.toLowerCase()) {
      case 'admin':
        activities = [
          ActivityItem('User created', 'New user registration', '2 min ago', Icons.person_add),
          ActivityItem('Content approved', 'Post #1245 approved', '15 min ago', Icons.check),
          ActivityItem('System update', 'Platform updated to v2.4', '1 hour ago', Icons.system_update),
          ActivityItem('Revenue report', 'Daily revenue: \$1,240', '2 hours ago', Icons.attach_money),
        ];
        break;
      case 'moderator':
        activities = [
          ActivityItem('Content reviewed', 'Reviewed post #4567', '5 min ago', Icons.remove_red_eye),
          ActivityItem('User warned', 'Warning issued to user #234', '20 min ago', Icons.warning),
          ActivityItem('Report resolved', 'Resolved report #789', '45 min ago', Icons.check_circle),
          ActivityItem('Guideline updated', 'Updated community guidelines', '2 hours ago', Icons.edit),
        ];
        break;
      case 'creator':
        activities = [
          ActivityItem('New follower', 'John Doe followed you', '10 min ago', Icons.person_add),
          ActivityItem('Post liked', 'Your post was liked 45 times', '30 min ago', Icons.thumb_up),
          ActivityItem('Earnings', 'Earned \$25.50 today', '1 hour ago', Icons.attach_money),
          ActivityItem('Comment', 'Received 12 comments', '3 hours ago', Icons.comment),
        ];
        break;
      case 'member':
        activities = [
          ActivityItem('New notification', 'You have 3 new notifications', '5 min ago', Icons.notifications),
          ActivityItem('Liked content', 'Liked a post by Sarah', '15 min ago', Icons.thumb_up),
          ActivityItem('Commented', 'Commented on a post', '45 min ago', Icons.comment),
          ActivityItem('Followed', 'Started following Alex', '2 hours ago', Icons.person_add),
        ];
        break;
      default:
        activities = [
          ActivityItem('Welcome', 'Welcome to the platform', 'Just now', Icons.verified),
          ActivityItem('Setup', 'Complete your profile', '5 min ago', Icons.person),
          ActivityItem('Explore', 'Start exploring content', '10 min ago', Icons.explore),
          ActivityItem('Connect', 'Follow other users', '15 min ago', Icons.people),
        ];
    }

    return ListView.builder(
      shrinkWrap: true,
      physics: NeverScrollableScrollPhysics(),
      itemCount: activities.length,
      itemBuilder: (context, index) {
        final activity = activities[index];
        return Card(
          child: ListTile(
            leading: Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: Colors.blue[50],
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(activity.icon, color: Colors.blue),
            ),
            title: Text(activity.title),
            subtitle: Text(activity.subtitle),
            trailing: Text(activity.time, style: TextStyle(color: Colors.grey[600])),
          ),
        );
      },
    );
  }

  Widget _buildResourceList() {
    List<ResourceItem> resources = [];
    
    switch (widget.userRole.toLowerCase()) {
      case 'admin':
        resources = [
          ResourceItem('Admin Guide', 'Platform administration manual', Icons.menu_book),
          ResourceItem('API Docs', 'Developer API documentation', Icons.code),
          ResourceItem('Analytics', 'Detailed platform analytics', Icons.analytics),
          ResourceItem('Security', 'Security best practices', Icons.security),
        ];
        break;
      case 'moderator':
        resources = [
          ResourceItem('Moderation Guide', 'Content moderation policies', Icons.menu_book),
          ResourceItem('Reporting', 'How to handle reports', Icons.report_problem),
          ResourceItem('Guidelines', 'Community guidelines', Icons.info),
          ResourceItem('Training', 'Moderator training materials', Icons.school),
        ];
        break;
      case 'creator':
        resources = [
          ResourceItem('Creator Hub', 'Resources for creators', Icons.star),
          ResourceItem('Monetization', 'Earning opportunities', Icons.attach_money),
          ResourceItem('Analytics', 'Content performance', Icons.bar_chart),
          ResourceItem('Promotion', 'Ways to grow your audience', Icons.trending_up),
        ];
        break;
      case 'member':
        resources = [
          ResourceItem('Getting Started', 'How to use the platform', Icons.help),
          ResourceItem('Safety Tips', 'Staying safe online', Icons.shield),
          ResourceItem('FAQ', 'Frequently asked questions', Icons.question_answer),
          ResourceItem('Community', 'Joining groups and discussions', Icons.groups),
        ];
        break;
      default:
        resources = [
          ResourceItem('Welcome', 'Getting started guide', Icons.verified),
          ResourceItem('Features', 'Platform features', Icons.apps),
          ResourceItem('Help', 'Need assistance?', Icons.help),
          ResourceItem('Community', 'Join our community', Icons.people),
        ];
    }

    return GridView.count(
      crossAxisCount: 2,
      crossAxisSpacing: 16,
      mainAxisSpacing: 16,
      shrinkWrap: true,
      physics: NeverScrollableScrollPhysics(),
      children: resources.map((resource) => _buildResourceCard(resource)).toList(),
    );
  }

  Widget _buildResourceCard(ResourceItem resource) {
    return Card(
      child: InkWell(
        onTap: () {},
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(resource.icon, color: Colors.blue, size: 30),
              SizedBox(height: 12),
              Text(
                resource.title,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
              SizedBox(height: 8),
              Text(
                resource.subtitle,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[600],
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class StatItem {
  final String title;
  final String value;
  final IconData icon;
  final Color color;

  StatItem(this.title, this.value, this.icon, this.color);
}

class ActionItem {
  final String title;
  final IconData icon;
  final Color color;
  final VoidCallback onPressed;

  ActionItem(this.title, this.icon, this.color, this.onPressed);
}

class ActivityItem {
  final String title;
  final String subtitle;
  final String time;
  final IconData icon;

  ActivityItem(this.title, this.subtitle, this.time, this.icon);
}

class ResourceItem {
  final String title;
  final String subtitle;
  final IconData icon;

  ResourceItem(this.title, this.subtitle, this.icon);
}