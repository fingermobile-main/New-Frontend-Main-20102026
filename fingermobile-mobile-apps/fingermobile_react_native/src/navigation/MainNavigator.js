import React from "react";
import { NavigationContainer } from "@react-navigation/native";;
import { createStackNavigator } from "@react-navigation/stack";;
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";;
import Icon from "react-native-vector-icons/MaterialIcons";

// Import screen components
import DashboardScreen from "../screens/DashboardScreen";
import PostsScreen from "../screens/PostsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import WalletScreen from "../screens/WalletScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import MarketplaceScreen from "../screens/MarketplaceScreen";
import ContentManagementScreen from "../screens/ContentManagementScreen";
import AdminDashboardScreen from "../screens/AdminDashboardScreen";

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator Component
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({tabBarIcon: ({ focused,
  color,
  size }) => {;
          let iconName;

          if (route.name === "Dashboard") {
            iconName = "dashboard";
          } else if (route.name === "Posts") {
            iconName = "article";
          } else if (route.name === "Profile") {
            iconName = "person";
          } else if (route.name === "Notifications") {
            iconName = "notifications";
          } else if (route.name === "Marketplace") {
            iconName = "shopping-bag";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
tabBarActiveTintColor: "#6200ee",
tabBarInactiveTintColor: "gray"
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Posts" component={PostsScreen} />
      <Tab.Screen name="Marketplace" component={MarketplaceScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Main Navigator Component
const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainTab">
        <Stack.Screen
          name="MainTab"
          component={MainTabNavigator}
          options={{headerShown: false }}
        />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen
          name="ContentManagement"
          component={ContentManagementScreen}
        />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>;
  );
};

export default MainNavigator;
