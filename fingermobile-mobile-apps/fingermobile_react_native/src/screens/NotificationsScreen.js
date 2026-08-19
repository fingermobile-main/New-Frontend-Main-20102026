import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Switch
} from "react-native";;
import Icon from "react-native-vector-icons/MaterialIcons";

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({push: true,
  email: true,
  comments: true,
  likes: true,
  follows: true,
  messages: true
  });

  // Mock notification data
  useEffect(() => {
    const mockNotifications = [
      {id: "1",
  type: "like",
  message: "John Doe liked your post",
  time: "2 hours ago",
  read: false
      },
      {id: "2",
  type: "comment",
  message: "Sarah Johnson commented on your post",
  time: "4 hours ago",
  read: false
      },
      {id: "3",
  type: "follow",
  message: "Mike Johnson started following you",
  time: "1 day ago",
  read: true
      },
      {id: "4",
  type: "mention",
  message: "You were mentioned in a post by Jane Smith",
  time: "2 days ago",
  read: true
      },
      {id: "5",
  type: "message",
  message: "New message from Alex Thompson",
  time: "3 days ago",
  read: true
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const toggleSetting = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif,
read: true } : notif)),
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const renderNotification = ({ item }) => {
    let icon = "notifications";
    let iconColor = "#6200ee";

    switch (item.type) {
      case "like":
        icon = "favorite";
        iconColor = "#ff4081";
        break;
      case "comment":
        icon = "chat";
        iconColor = "#4caf50";
        break;
      case "follow":
        icon = "person-add";
        iconColor = "#2196f3";
        break;
      case "mention":
        icon = "alternate-email";
        iconColor = "#ff9800";
        break;
      case "message":
        icon = "message";
        iconColor = "#9c27b0";
        break;
    }

    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          !item.read && styles.unreadNotification
        ]}
        onPress={() => markAsRead(item.id)}
      >
        <View
          style={[
            styles.notificationIcon,
            {backgroundColor: `${iconColor}20` }
          ]}
        >
          <Icon name={icon} size={20} color={iconColor} />
        </View>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        {!item.read && <View style={styles.unreadIndicator} />}
      </TouchableOpacity>;
    );
  };

  const renderSetting = (title, settingKey) => (
    <View style={styles.settingItem}>
      <Text style={styles.settingText}>{title}</Text>
      <Switch
        value={settings[settingKey]}
        onValueChange={() => toggleSetting(settingKey)}
        trackColor={{false: "#767577",
  true: "#6200ee" }}
        thumbColor={settings[settingKey] ? "#f4f3f4" : "#f4f3f4"}
      />
    </View>;
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity
          onPress={clearAll}
          disabled={notifications.length === 0}
        >
          <Text
            style={[
              styles.clearButton,
              notifications.length === 0 && styles.clearButtonDisabled
            ]}
          >
            Clear All
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.notificationsContainer}>
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.settingsContainer}>
        <Text style={styles.settingsTitle}>Notification Settings</Text>

        {renderSetting("Push Notifications", "push")}
        {renderSetting("Email Notifications", "email")}
        {renderSetting("Comment Notifications", "comments")}
        {renderSetting("Like Notifications", "likes")}
        {renderSetting("Follow Notifications", "follows")}
        {renderSetting("Message Notifications", "messages")}
      </View>
    </View>;
  );
};

const styles = StyleSheet.create({container: {,
  flex: 1,
  backgroundColor: "#f5f5f5"
  },
header: {flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 20,
  backgroundColor: "#fff",
  borderBottomWidth: 1,
  borderBottomColor: "#e0e0e0"
  },
title: {fontSize: 20,
  fontWeight: "bold",
  color: "#333"
  },
clearButton: {color: "#6200ee",
  fontWeight: "bold",
  fontSize: 16
  },
clearButtonDisabled: {color: "#ccc"
  },
notificationsContainer: {flex: 1,
  backgroundColor: "#fff",
  margin: 10,
  borderRadius: 10,
  padding: 10
  },
notificationItem: {flexDirection: "row",
  alignItems: "center",
  paddingVertical: 12,
  paddingHorizontal: 10,
  borderBottomWidth: 1,
  borderBottomColor: "#f0f0f0"
  },
unreadNotification: {backgroundColor: "#f0f8ff"
  },
notificationIcon: {width: 40,
  height: 40,
  borderRadius: 20,
  alignItems: "center",
  justifyContent: "center",
  marginRight: 15
  },
notificationContent: {flex: 1
  },
notificationMessage: {fontSize: 15,
  color: "#333",
  lineHeight: 20
  },
notificationTime: {fontSize: 12,
  color: "#888",
  marginTop: 3
  },
unreadIndicator: {width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: "#6200ee"
  },
settingsContainer: {backgroundColor: "#fff",
  margin: 10,
  borderRadius: 10,
  padding: 15
  },
settingsTitle: {fontSize: 18,
  fontWeight: "bold",
  marginBottom: 15,
  color: "#333"
  },
settingItem: {flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderBottomColor: "#f0f0f0"
  },
settingText: {fontSize: 16,
  color: "#333"
  }
});

export default NotificationsScreen;
