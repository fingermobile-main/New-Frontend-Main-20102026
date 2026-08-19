import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList
} from "react-native";;
import Icon from "react-native-vector-icons/MaterialIcons";

const AdminDashboardScreen = () => {
  const [stats, setStats] = useState({totalmembers: 12456,
  activemembers: 8742,
  totalPosts: 56789,
  totalRevenue: 124567.89
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [adminActions] = useState([
    {id: 1,
  title: "member Management",
  icon: "people",
  screen: "Adminmembers"
    },
    {id: 2,
  title: "Content Moderation",
  icon: "flag",
  screen: "ContentModeration"
    },
    {id: 3,
  title: "System Settings",
  icon: "settings",
  screen: "SystemSettings"
    },
    {id: 4,
  title: "Reports",
  icon: "report",
  screen: "Reports" },
    {id: 5,
  title: "Audit Logs",
  icon: "list",
  screen: "AuditLogs" },
    {id: 6,
  title: "Feature Flags",
  icon: "toggle-on",
  screen: "FeatureFlags"
    },
    {id: 7,
  title: "Platform Metrics",
  icon: "bar-chart",
  screen: "PlatformMetrics"
    },
    {id: 8,
  title: "Permissions",
  icon: "lock",
  screen: "AdminPermissions" }
  ]);

  // Mock recent activities
  useEffect(() => {
    const mockActivities = [
      {id: 1,
  member: "John Doe",
  action: "Account Suspended",
  time: "2 min ago",
  type: "warning"
      },
      {id: 2,
  member: "Jane Smith",
  action: "Report Reviewed",
  time: "15 min ago",
  type: "info"
      },
      {id: 3,
  member: "Mike Johnson",
  action: "Content Removed",
  time: "1 hour ago",
  type: "danger"
      },
      {id: 4,
  member: "Sarah Williams",
  action: "Account Verified",
  time: "2 hours ago",
  type: "success"
      },
      {id: 5,
  member: "Alex Thompson",
  action: "Feature Flag Updated",
  time: "3 hours ago",
  type: "info"
      }
    ];
    setRecentActivities(mockActivities);
  }, []);

  const renderStatCard = (title, value, icon, color) => (
    <View style={styles.statCard}>
      <View
        style={[styles.statIconContainer, {backgroundColor: `${color}20` }]}
      >
        <Icon name={icon} size={30} color={color} />
      </View>
      <View style={styles.statTextContainer}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>;
  );

  const renderAction = ({ item }) => (
    <TouchableOpacity style={styles.actionItem}>
      <View style={[styles.actionIcon, {backgroundColor: "#f0f0f0" }]}>
        <Icon name={item.icon} size={24} color="#6200ee" />
      </View>
      <Text style={styles.actionText}>{item.title}</Text>
      <Icon name="chevron-right" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  const renderActivity = ({ item }) => {
    let icon = "info";
    let iconColor = "#2196f3";

    switch (item.type) {
      case "success":
        icon = "check-circle";
        iconColor = "#4caf50";
        break;
      case "warning":
        icon = "warning";
        iconColor = "#ff9800";
        break;
      case "danger":
        icon = "error";
        iconColor = "#f44336";
        break;
      case "info":
        icon = "info";
        iconColor = "#2196f3";
        break;
    }

    return (
      <View style={styles.activityItem}>
        <View
          style={[styles.activityIcon, {backgroundColor: `${iconColor}20` }]}
        >
          <Icon name={icon} size={20} color={iconColor} />
        </View>
        <View style={styles.activityContent}>
          <Text style={styles.activitymember}>{item.member}</Text>
          <Text style={styles.activityAction}>{item.action}</Text>
        </View>
        <Text style={styles.activityTime}>{item.time}</Text>
      </View>;
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>System Administration Panel</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        {renderStatCard(
          "Total members",
          stats.totalmembers.toLocaleString(),
          "people",
          "#6200ee",
        )}
        {renderStatCard(
          "Active members",
          stats.activemembers.toLocaleString(),
          "visibility",
          "#4caf50",
        )}
        {renderStatCard(
          "Total Posts",
          stats.totalPosts.toLocaleString(),
          "article",
          "#ff9800",
        )}
        {renderStatCard(
          "Revenue",
          `$${stats.totalRevenue.toLocaleString()}`,
          "monetization-on",
          "#2196f3",
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <FlatList
          data={adminActions}
          renderItem={renderAction}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </View>

      {/* Recent Activities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        <FlatList
          data={recentActivities}
          renderItem={renderActivity}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </View>

      {/* System Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Status</Text>
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Icon name="cloud-queue" size={24} color="#4caf50" />
            <Text style={styles.statusText}>API,
Server: Online</Text>
          </View>
          <View style={styles.statusItem}>
            <Icon name="storage" size={24} color="#4caf50" />
            <Text style={styles.statusText}>,
Database: Online</Text>
          </View>
        </View>
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Icon name="memory" size={24} color="#ff9800" />
            <Text style={styles.statusText}>,
Cache: Warning</Text>
          </View>
          <View style={styles.statusItem}>
            <Icon name="storage" size={24} color="#4caf50" />
            <Text style={styles.statusText}>,
Storage: Healthy</Text>
          </View>
        </View>
      </View>
    </ScrollView>;
  );
};

const styles = StyleSheet.create({container: {,
  flex: 1,
  backgroundColor: "#f5f5f5"
  },
header: {backgroundColor: "#fff",
  padding: 20,
  borderBottomWidth: 1,
  borderBottomColor: "#e0e0e0"
  },
title: {fontSize: 24,
  fontWeight: "bold",
  color: "#333"
  },
subtitle: {fontSize: 14,
  color: "#888",
  marginTop: 5
  },
statsContainer: {flexDirection: "row",
  flexWrap: "wrap",
  padding: 10
  },
statCard: {flex: 1,
  minWidth: "48%",
  backgroundColor: "#fff",
  borderRadius: 10,
  padding: 15,
  margin: 5,
  flexDirection: "row",
  alignItems: "center",
  elevation: 2,
  shadowColor: "#000",
  shadowOffset: {,
  width: 0,
  height: 1 },
shadowOpacity: 0.1,
shadowRadius: 2
  },
statIconContainer: {width: 50,
  height: 50,
  borderRadius: 25,
  alignItems: "center",
  justifyContent: "center",
  marginRight: 15
  },
statTextContainer: {},
statValue: {fontSize: 20,
  fontWeight: "bold",
  color: "#333"
  },
statTitle: {fontSize: 14,
  color: "#888",
  marginTop: 3
  },
section: {backgroundColor: "#fff",
  margin: 10,
  borderRadius: 10,
  padding: 15,
  elevation: 2,
  shadowColor: "#000",
  shadowOffset: {,
  width: 0,
  height: 1 },
shadowOpacity: 0.1,
shadowRadius: 2
  },
sectionTitle: {fontSize: 18,
  fontWeight: "bold",
  color: "#333",
  marginBottom: 15
  },
actionItem: {flexDirection: "row",
  alignItems: "center",
  paddingVertical: 15,
  borderBottomWidth: 1,
  borderBottomColor: "#f0f0f0"
  },
actionIcon: {width: 40,
  height: 40,
  borderRadius: 20,
  alignItems: "center",
  justifyContent: "center",
  marginRight: 15
  },
actionText: {flex: 1,
  fontSize: 16,
  color: "#333"
  },
activityItem: {flexDirection: "row",
  alignItems: "center",
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: "#f0f0f0"
  },
activityIcon: {width: 36,
  height: 36,
  borderRadius: 18,
  alignItems: "center",
  justifyContent: "center",
  marginRight: 12
  },
activityContent: {flex: 1
  },
activitymember: {fontSize: 14,
  fontWeight: "bold",
  color: "#333"
  },
activityAction: {fontSize: 13,
  color: "#666"
  },
activityTime: {fontSize: 12,
  color: "#888"
  },
statusRow: {flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 10
  },
statusItem: {flexDirection: "row",
  alignItems: "center",
  flex: 0.48
  },
statusText: {fontSize: 14,
  color: "#333",
  marginLeft: 10
  }
});

export default AdminDashboardScreen;
