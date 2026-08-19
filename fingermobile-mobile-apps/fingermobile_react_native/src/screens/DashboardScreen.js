import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";;
import Icon from "react-native-vector-icons/MaterialIcons";

const DashboardScreen = ({ navigation }) => {
  const features = [
    {id: 1,
  name: "Posts",
  icon: "article",
  screen: "Posts" },
    {id: 2,
  name: "Profile",
  icon: "person",
  screen: "Profile" },
    {id: 3,
  name: "Wallet",
  icon: "account-balance-wallet",
  screen: "Wallet" },
    {id: 4,
  name: "Notifications",
  icon: "notifications",
  screen: "Notifications"
    },
    {id: 5,
  name: "Settings",
  icon: "settings",
  screen: "Settings" },
    {id: 6,
  name: "Marketplace",
  icon: "shopping-bag",
  screen: "Marketplace" },
    {id: 7,
  name: "Content Management",
  icon: "edit",
  screen: "ContentManagement"
    },
    {id: 8,
  name: "Admin Dashboard",
  icon: "admin-panel-settings",
  screen: "AdminDashboard"
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>FingerMobile Dashboard</Text>
        <Text style={styles.subtitle}>Welcome to your mobile experience</Text>
      </View>

      <View style={styles.featuresContainer}>
        {features.map((feature) => (
          <TouchableOpacity
            key={feature.id}
            style={styles.featureCard}
            onPress={() => navigation.navigate(feature.screen)}
          >
            <Icon name={feature.icon} size={30} color="#6200ee" />
            <Text style={styles.featureText}>{feature.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>;
  );
};

const styles = StyleSheet.create({container: {,
  flex: 1,
  backgroundColor: "#f5f5f5"
  },
header: {padding: 20,
  backgroundColor: "#fff",
  alignItems: "center"
  },
title: {fontSize: 24,
  fontWeight: "bold",
  color: "#333"
  },
subtitle: {fontSize: 16,
  color: "#666",
  marginTop: 5
  },
featuresContainer: {flex: 1,
  padding: 15,
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between"
  },
featureCard: {width: "48%",
  height: 100,
  backgroundColor: "#fff",
  borderRadius: 8,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 10,
  elevation: 3,
  shadowColor: "#000",
  shadowOffset: {,
  width: 0,
  height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4
  },
featureText: {marginTop: 8,
  fontSize: 14,
  fontWeight: "500",
  color: "#333",
  textAlign: "center"
  }
});

export default DashboardScreen;
