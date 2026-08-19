import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch
} from "react-native";;
import Icon from "react-native-vector-icons/MaterialIcons";

const SettingsScreen = () => {
  const [settings, setSettings] = useState({notifications: true,
  location: false,
  privacy: true,
  darkMode: false,
  autoSave: true,
  biometricAuth: false,
  dataSaver: false
  });

  const toggleSetting = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const settingOptions = [
    {id: "privacy",
  title: "Privacy Settings",
  icon: "lock",
  screen: "PrivacySettings"
    },
    {id: "notifications",
  title: "Notification Settings",
  icon: "notifications",
  screen: "NotificationSettings"
    },
    {id: "account",
  title: "Account Settings",
  icon: "account-circle",
  screen: "AccountSettings"
    },
    {id: "security",
  title: "Security Settings",
  icon: "security",
  screen: "SecuritySettings"
    },
    {id: "data",
  title: "Data Usage",
  icon: "data-usage",
  screen: "DataUsage"
    },
    {id: "help",
  title: "Help & Support",
  icon: "help",
  screen: "HelpAndSupport"
    },
    {id: "about",
  title: "About",
  icon: "info",
  screen: "About" }
  ];

  const renderSettingOption = (option) => (
    <TouchableOpacity style={styles.optionItem}>
      <View style={styles.optionIcon}>
        <Icon name={option.icon} size={24} color="#6200ee" />
      </View>
      <Text style={styles.optionText}>{option.title}</Text>
      <Icon name="chevron-right" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  const renderToggleOption = (key, title, icon) => (
    <View style={styles.toggleOption}>
      <View style={styles.optionIcon}>
        <Icon name={icon} size={24} color="#6200ee" />
      </View>
      <Text style={styles.optionText}>{title}</Text>
      <Switch
        value={settings[key]}
        onValueChange={() => toggleSetting(key)}
        trackColor={{false: "#767577",
  true: "#6200ee" }}
        thumbColor={settings[key] ? "#f4f3f4" : "#f4f3f4"}
      />
    </View>;
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>

        {renderToggleOption("darkMode", "Dark Mode", "brightness-4")}
        {renderToggleOption("autoSave", "Auto Save", "save")}
        {renderToggleOption("dataSaver", "Data Saver", "data-saver")}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        {settingOptions
          .slice(0, 4)
          .map((option) => renderSettingOption(option))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        {renderToggleOption("notifications", "Notifications", "notifications")}
        {renderToggleOption("location", "Location Services", "location-on")}
        {renderToggleOption(
          "biometricAuth",
          "Biometric Authentication",
          "fingerprint",
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>

        {settingOptions.slice(5).map((option) => renderSettingOption(option))}
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton}>
          <Icon name="exit-to-app" size={24} color="#fff" />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({container: {,
  flex: 1,
  backgroundColor: "#f5f5f5"
  },
header: {padding: 20,
  backgroundColor: "#fff",
  borderBottomWidth: 1,
  borderBottomColor: "#e0e0e0"
  },
title: {fontSize: 24,
  fontWeight: "bold",
  color: "#333"
  },
section: {backgroundColor: "#fff",
  margin: 10,
  borderRadius: 10,
  padding: 0,
  overflow: "hidden"
  },
sectionTitle: {fontSize: 16,
  fontWeight: "bold",
  color: "#6200ee",
  padding: 15,
  backgroundColor: "#f5f5f5",
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10
  },
optionItem: {flexDirection: "row",
  alignItems: "center",
  paddingVertical: 15,
  paddingHorizontal: 15,
  borderBottomWidth: 1,
  borderBottomColor: "#f0f0f0"
  },
toggleOption: {flexDirection: "row",
  alignItems: "center",
  paddingVertical: 15,
  paddingHorizontal: 15,
  borderBottomWidth: 1,
  borderBottomColor: "#f0f0f0"
  },
optionIcon: {width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "rgba(98, 0, 238, 0.1)",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 15
  },
optionText: {flex: 1,
  fontSize: 16,
  color: "#333"
  },
logoutButton: {flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 15,
  backgroundColor: "#f44336",
  margin: 15,
  borderRadius: 10
  },
logoutButtonText: {color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
  marginLeft: 10
  }
});

export default SettingsScreen;
