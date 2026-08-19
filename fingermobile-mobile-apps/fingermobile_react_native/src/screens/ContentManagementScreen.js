import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Switch
} from "react-native";;
import Icon from "react-native-vector-icons/MaterialIcons";

const ContentManagementScreen = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [contentItems, setContentItems] = useState({all: [],
  posts: [],
  scheduled: [],
  drafts: [],
  published: []
  });

  // Mock content data
  useEffect(() => {
    const mockContent = [
      {id: "1",
  title: "My Summer Vacation",
  type: "post",
  status: "published",
  date: "Dec 25, 2025",
  views: 1245,
  likes: 89,
  comments: 12,
  thumbnail: ",
  https://via.placeholder.com/80"
      },
      {id: "2",
  title: "Top 10 Tech Trends",
  type: "post",
  status: "draft",
  date: "Dec 24, 2025",
  views: 0,
  likes: 0,
  comments: 0,
  thumbnail: ",
  https://via.placeholder.com/80"
      },
      {id: "3",
  title: "New Product Launch",
  type: "post",
  status: "scheduled",
  date: "Dec 30, 2025",
  views: 0,
  likes: 0,
  comments: 0,
  thumbnail: ",
  https://via.placeholder.com/80"
      },
      {id: "4",
  title: "Cooking Tutorial",
  type: "video",
  status: "published",
  date: "Dec 23, 2025",
  views: 5672,
  likes: 245,
  comments: 42,
  thumbnail: ",
  https://via.placeholder.com/80"
      },
      {id: "5",
  title: "Travel Tips",
  type: "post",
  status: "published",
  date: "Dec 22, 2025",
  views: 3421,
  likes: 187,
  comments: 28,
  thumbnail: ",
  https://via.placeholder.com/80"
      },
      {id: "6",
  title: "Design Inspiration",
  type: "image",
  status: "draft",
  date: "Dec 21, 2025",
  views: 0,
  likes: 0,
  comments: 0,
  thumbnail: ",
  https://via.placeholder.com/80"
      }
    ];

    setContentItems({all: mockContent,
  posts: mockContent.filter((item) => item.type === "post"),
  scheduled: mockContent.filter((item) => item.status === "scheduled"),
  drafts: mockContent.filter((item) => item.status === "draft"),
  published: mockContent.filter((item) => item.status === "published")
    });
  }, []);

  const renderTabButton = (tabKey, title) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tabKey && styles.activeTabButton]}
      onPress={() => setActiveTab(tabKey)}
    >
      <Text
        style={[styles.tabText, activeTab === tabKey && styles.activeTabText]}
      >
        {title}
      </Text>
    </TouchableOpacity>;
  );

  const renderContentItem = ({ item }) => {
    let icon = "description";
    let iconColor = "#6200ee";

    switch (item.type) {
      case "video":
        icon = "slideshow";
        iconColor = "#ff5722";
        break;
      case "image":
        icon = "image";
        iconColor = "#4caf50";
        break;
      case "post":
        icon = "article";
        iconColor = "#2196f3";
        break;
    }

    return (
      <View style={styles.contentItem}>
        <Image source={{uri: item.thumbnail }} style={styles.thumbnail} />
        <View style={styles.contentInfo}>
          <View style={styles.contentHeader}>
            <Icon name={icon} size={20} color={iconColor} />
            <Text style={styles.contentType}>{item.type.toUpperCase()}</Text>
            <View
              style={[
                styles.statusBadge,
                {backgroundColor: getStatusColor(item.status) }
              ]}
            >
              <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
            </View>
          </View>

          <Text style={styles.contentTitle} numberOfLines={2}>
            {item.title}
          </Text>

          <Text style={styles.contentDate}>{item.date}</Text>

          <View style={styles.contentStats}>
            <View style={styles.statItem}>
              <Icon name="remove-red-eye" size={14} color="#888" />
              <Text style={styles.statText}>{item.views}</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="favorite-border" size={14} color="#888" />
              <Text style={styles.statText}>{item.likes}</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="chat-bubble-outline" size={14} color="#888" />
              <Text style={styles.statText}>{item.comments}</Text>
            </View>
          </View>
        </View>
      </View>;
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "#4caf50";
      case "draft":
        return "#ff9800";
      case "scheduled":
        return "#2196f3";,
default:
        return "#9e9e9e";
    }
  };

  const currentContent = contentItems[activeTab] || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Content Management</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabsContainer}>
        {renderTabButton("all", "All")}
        {renderTabButton("posts", "Posts")}
        {renderTabButton("published", "Published")}
        {renderTabButton("scheduled", "Scheduled")}
        {renderTabButton("drafts", "Drafts")}
      </View>

      {/* Content List */}
      <FlatList
        data={currentContent}
        renderItem={renderContentItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentList}
      />

      {/* Create Content Button */}
      <TouchableOpacity style={styles.createButton}>
        <Icon name="add" size={24} color="#fff" />
        <Text style={styles.createButtonText}>Create Content</Text>
      </TouchableOpacity>
    </View>;
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
tabsContainer: {flexDirection: "row",
  backgroundColor: "#fff",
  padding: 10
  },
tabButton: {flex: 1,
  paddingVertical: 10,
  alignItems: "center",
  borderBottomWidth: 2,
  borderBottomColor: "transparent"
  },
activeTabButton: {borderBottomColor: "#6200ee"
  },
tabText: {fontSize: 14,
  color: "#888"
  },
activeTabText: {color: "#6200ee",
  fontWeight: "bold"
  },
contentList: {padding: 10
  },
contentItem: {backgroundColor: "#fff",
  borderRadius: 10,
  flexDirection: "row",
  padding: 15,
  marginBottom: 10,
  elevation: 2,
  shadowColor: "#000",
  shadowOffset: {,
  width: 0,
  height: 1 },
shadowOpacity: 0.1,
shadowRadius: 2
  },
thumbnail: {width: 60,
  height: 60,
  borderRadius: 8,
  marginRight: 15
  },
contentInfo: {flex: 1
  },
contentHeader: {flexDirection: "row",
  alignItems: "center",
  marginBottom: 5
  },
contentType: {fontSize: 12,
  color: "#666",
  marginLeft: 5,
  fontWeight: "bold"
  },
statusBadge: {marginLeft: "auto",
  paddingHorizontal: 6,
  paddingVertical: 2,
  borderRadius: 10
  },
statusText: {fontSize: 10,
  color: "#fff",
  fontWeight: "bold"
  },
contentTitle: {fontSize: 16,
  fontWeight: "bold",
  color: "#333",
  marginBottom: 5
  },
contentDate: {fontSize: 12,
  color: "#888",
  marginBottom: 8
  },
contentStats: {flexDirection: "row",
  justifyContent: "space-around"
  },
statItem: {flexDirection: "row",
  alignItems: "center"
  },
statText: {fontSize: 12,
  color: "#666",
  marginLeft: 4
  },
createButton: {position: "absolute",
  bottom: 20,
  right: 20,
  backgroundColor: "#6200ee",
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 25,
  elevation: 8,
  shadowColor: "#000",
  shadowOffset: {,
  width: 0,
  height: 4 },
shadowOpacity: 0.3,
shadowRadius: 4
  },
createButtonText: {color: "#fff",
  fontWeight: "bold",
  fontSize: 14,
  marginLeft: 8
  }
});

export default ContentManagementScreen;
