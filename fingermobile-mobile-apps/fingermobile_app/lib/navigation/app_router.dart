import 'package:flutter/material.dart';
import 'package:fingermobile_app/screens/blog_page.dart';
import 'package:fingermobile_app/screens/posts_page.dart';
import 'package:fingermobile_app/screens/content_management_page.dart';
import 'package:fingermobile_app/screens/content_schedule_page.dart';
import 'package:fingermobile_app/screens/content_analytics_page.dart';
import 'package:fingermobile_app/screens/create_scheduled_content_page.dart';
import 'package:fingermobile_app/screens/edit_scheduled_content_page.dart';
import 'package:fingermobile_app/screens/community_page.dart';
import 'package:fingermobile_app/screens/groups_page.dart';
import 'package:fingermobile_app/screens/notifications_page.dart';
import 'package:fingermobile_app/screens/marketplace_page.dart';
import 'package:fingermobile_app/screens/wallet_page.dart';
import 'package:fingermobile_app/screens/profile_page.dart';
import 'package:fingermobile_app/screens/settings_page.dart';
import 'package:fingermobile_app/screens/admin_dashboard_page.dart';
import 'package:fingermobile_app/screens/privacy_settings_page.dart';
import 'package:fingermobile_app/screens/notification_settings_page.dart';
import 'package:fingermobile_app/screens/member_management_page.dart';
import 'package:fingermobile_app/screens/content_moderation_page.dart';
import 'package:fingermobile_app/screens/moderation_queue_page.dart';
import 'package:fingermobile_app/screens/reports_page.dart';
import 'package:fingermobile_app/screens/system_settings_page.dart';
import 'package:fingermobile_app/screens/platform_metrics_page.dart';
import 'package:fingermobile_app/screens/admin_members_page.dart';
import 'package:fingermobile_app/screens/admin_permissions_page.dart';
import 'package:fingermobile_app/screens/audit_logs_page.dart';
import 'package:fingermobile_app/screens/feature_flags_page.dart';
import 'package:fingermobile_app/screens/database_integration_dashboard.dart';
import 'package:fingermobile_app/screens/security_dashboard_page.dart';
import 'package:fingermobile_app/screens/home_page.dart';
import 'package:fingermobile_app/screens/dashboard_page.dart';
import 'package:fingermobile_app/screens/content_creator_dashboard_page.dart';
import 'package:fingermobile_app/screens/social_feed_page.dart';
import 'package:fingermobile_app/screens/product_detail_page.dart';
import 'package:fingermobile_app/screens/subscription_plans_page.dart';
import 'package:fingermobile_app/screens/edit_profile_page.dart';
import 'package:fingermobile_app/screens/support_page.dart';
import 'package:fingermobile_app/screens/search_page.dart';
import 'package:fingermobile_app/screens/messages_page.dart';
import 'package:fingermobile_app/screens/cart_page.dart';
import 'package:fingermobile_app/screens/revenue_dashboard_page.dart';
import 'package:fingermobile_app/screens/notification_preferences_page.dart';
import 'package:fingermobile_app/screens/followers_page.dart';
import 'package:fingermobile_app/screens/order_history_page.dart';
import 'package:fingermobile_app/screens/payment_methods_page.dart';
import 'package:fingermobile_app/screens/privacy_controls_page.dart';
import 'package:fingermobile_app/screens/content_approval_page.dart';
import 'package:fingermobile_app/screens/activity_feed_page.dart';
import 'package:fingermobile_app/screens/member_analytics_page.dart';
import 'package:fingermobile_app/screens/connections_manager_page.dart';
import 'package:fingermobile_app/screens/security_settings_page.dart';
import 'package:fingermobile_app/screens/two_factor_auth_settings_page.dart';
import 'package:fingermobile_app/screens/member_journey_tracker_page.dart';
import 'package:fingermobile_app/screens/page_navigation_dashboard_page.dart';
import 'package:fingermobile_app/screens/blocked_members_page.dart';
import 'package:fingermobile_app/screens/session_management_page.dart';
import 'package:fingermobile_app/screens/account_settings_page.dart';
import 'package:fingermobile_app/screens/superadmin_dashboard_page.dart';
import 'package:fingermobile_app/screens/login_history_page.dart';
import 'package:fingermobile_app/screens/messaging_page.dart';
import 'package:fingermobile_app/screens/multi_media_hub_page.dart';
import 'package:fingermobile_app/screens/editor_studio_page.dart';
import 'package:fingermobile_app/screens/permanence_page.dart';
import 'package:fingermobile_app/screens/cache_demo_page.dart';
import 'package:fingermobile_app/screens/terms_of_service_page.dart';
import 'package:fingermobile_app/screens/privacy_policy_page.dart';
import 'package:fingermobile_app/screens/help_and_support_page.dart';
import 'package:fingermobile_app/screens/legal_compliance_page.dart';
import 'package:fingermobile_app/screens/data_export_page.dart';

class AppRouter {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case '/':
        return MaterialPageRoute(builder: (_) => HomePage());
      case '/blog':
        return MaterialPageRoute(builder: (_) => BlogPage());
      case '/posts':
        return MaterialPageRoute(builder: (_) => PostsPage());
      case '/content-management':
        return MaterialPageRoute(builder: (_) => ContentManagementPage());
      case '/content-schedule':
        return MaterialPageRoute(builder: (_) => ContentSchedulePage());
      case '/content-analytics':
        return MaterialPageRoute(builder: (_) => ContentAnalyticsPage());
      case '/create-scheduled-content':
        return MaterialPageRoute(builder: (_) => CreateScheduledContentPage());
      case '/edit-scheduled-content':
        return MaterialPageRoute(builder: (_) => EditScheduledContentPage());
      case '/community':
        return MaterialPageRoute(builder: (_) => CommunityPage());
      case '/groups':
        return MaterialPageRoute(builder: (_) => GroupsPage());
      case '/notifications':
        return MaterialPageRoute(builder: (_) => NotificationsPage());
      case '/marketplace':
        return MaterialPageRoute(builder: (_) => MarketplacePage());
      case '/wallet':
        return MaterialPageRoute(builder: (_) => WalletPage());
      case '/profile':
        return MaterialPageRoute(builder: (_) => ProfilePage());
      case '/settings':
        return MaterialPageRoute(builder: (_) => SettingsPage());
      case '/admin-dashboard':
        return MaterialPageRoute(builder: (_) => AdminDashboardPage());
      case '/privacy-settings':
        return MaterialPageRoute(builder: (_) => PrivacySettingsPage());
      case '/notification-settings':
        return MaterialPageRoute(builder: (_) => NotificationSettingsPage());
      case '/member-management':
        return MaterialPageRoute(builder: (_) => memberManagementPage());
      case '/content-moderation':
        return MaterialPageRoute(builder: (_) => ContentModerationPage());
      case '/moderation-queue':
        return MaterialPageRoute(builder: (_) => ModerationQueuePage());
      case '/reports':
        return MaterialPageRoute(builder: (_) => ReportsPage());
      case '/system-settings':
        return MaterialPageRoute(builder: (_) => SystemSettingsPage());
      case '/platform-metrics':
        return MaterialPageRoute(builder: (_) => PlatformMetricsPage());
      case '/admin-members':
        return MaterialPageRoute(builder: (_) => AdminmembersPage());
      case '/admin-permissions':
        return MaterialPageRoute(builder: (_) => AdminPermissionsPage());
      case '/audit-logs':
        return MaterialPageRoute(builder: (_) => AuditLogsPage());
      case '/feature-flags':
        return MaterialPageRoute(builder: (_) => FeatureFlagsPage());
      case '/database-integration':
        return MaterialPageRoute(builder: (_) => DatabaseIntegrationDashboard());
      case '/security-dashboard':
        return MaterialPageRoute(builder: (_) => SecurityDashboardPage());
      case '/home':
        return MaterialPageRoute(builder: (_) => HomePage());
      case '/dashboard':
        return MaterialPageRoute(builder: (_) => DashboardPage());
      case '/content-creator-dashboard':
        return MaterialPageRoute(builder: (_) => ContentCreatorDashboardPage());
      case '/social-feed':
        return MaterialPageRoute(builder: (_) => SocialFeedPage());
      case '/product-detail':
        return MaterialPageRoute(builder: (_) => ProductDetailPage(productId: '123'));
      case '/subscription-plans':
        return MaterialPageRoute(builder: (_) => SubscriptionPlansPage());
      case '/edit-profile':
        return MaterialPageRoute(builder: (_) => EditProfilePage());
      case '/support':
        return MaterialPageRoute(builder: (_) => SupportPage());
      case '/search':
        return MaterialPageRoute(builder: (_) => SearchPage());
      case '/messages':
        return MaterialPageRoute(builder: (_) => MessagesPage());
      case '/cart':
        return MaterialPageRoute(builder: (_) => CartPage());
      case '/revenue-dashboard':
        return MaterialPageRoute(builder: (_) => RevenueDashboardPage());
      case '/notification-preferences':
        return MaterialPageRoute(builder: (_) => NotificationPreferencesPage());
      case '/followers':
        return MaterialPageRoute(builder: (_) => FollowersPage(type: 'followers'));
      case '/following':
        return MaterialPageRoute(builder: (_) => FollowersPage(type: 'following'));
      case '/order-history':
        return MaterialPageRoute(builder: (_) => OrderHistoryPage());
      case '/payment-methods':
        return MaterialPageRoute(builder: (_) => PaymentMethodsPage());
      case '/privacy-controls':
        return MaterialPageRoute(builder: (_) => PrivacyControlsPage());
      case '/content-approval':
        return MaterialPageRoute(builder: (_) => ContentApprovalPage());
      case '/activity-feed':
        return MaterialPageRoute(builder: (_) => ActivityFeedPage());
      case '/member-analytics':
        return MaterialPageRoute(builder: (_) => memberAnalyticsPage());
      case '/connections':
        return MaterialPageRoute(builder: (_) => ConnectionsManagerPage());
      case '/security-settings':
        return MaterialPageRoute(builder: (_) => SecuritySettingsPage());
      case '/two-factor-auth':
        return MaterialPageRoute(builder: (_) => TwoFactorAuthSettingsPage());
      case '/member-journey':
        return MaterialPageRoute(builder: (_) => memberJourneyTrackerPage());
      case '/page-navigation':
        return MaterialPageRoute(builder: (_) => PageNavigationDashboardPage());
      case '/blocked-members':
        return MaterialPageRoute(builder: (_) => BlockedmembersPage());
      case '/session-management':
        return MaterialPageRoute(builder: (_) => SessionManagementPage());
      case '/account-settings':
        return MaterialPageRoute(builder: (_) => AccountSettingsPage());
      case '/superadmin-dashboard':
        return MaterialPageRoute(builder: (_) => SuperadminDashboardPage());
      case '/login-history':
        return MaterialPageRoute(builder: (_) => LoginHistoryPage());
      case '/messaging':
        return MaterialPageRoute(builder: (_) => MessagingPage());
      case '/multi-media-hub':
        return MaterialPageRoute(builder: (_) => MultiMediaHubPage());
      case '/editor-studio':
        return MaterialPageRoute(builder: (_) => EditorStudioPage());
      case '/permanence':
        return MaterialPageRoute(builder: (_) => PermanencePage());
      case '/cache-demo':
        return MaterialPageRoute(builder: (_) => CacheDemoPage());
      case '/terms-of-service':
        return MaterialPageRoute(builder: (_) => TermsOfServicePage());
      case '/privacy-policy':
        return MaterialPageRoute(builder: (_) => PrivacyPolicyPage());
      case '/help-and-support':
        return MaterialPageRoute(builder: (_) => HelpAndSupportPage());
      case '/legal-compliance':
        return MaterialPageRoute(builder: (_) => LegalCompliancePage());
      case '/data-export':
        return MaterialPageRoute(builder: (_) => DataExportPage());
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('No route defined for ${settings.name}'),
            ),
          ),
        );
    }
  }
}