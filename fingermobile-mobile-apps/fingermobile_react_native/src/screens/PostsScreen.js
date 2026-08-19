import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl
} from "react-native";;
import Icon from "react-native-vector-icons/MaterialIcons";

const PostsScreen = () => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for posts
  useEffect(() => {
    // In a real app, this would fetch from an API
    const mockPosts = [
      {id: "1",
  author: "John Doe",
  avatar: ",
  https://via.placeholder.com/40",
  content:
          "Just launched my new project! Excited to share it with everyone.",
  timestamp: "2 hours ago",
  likes: 24,
  comments: 5,
  shares: 2
      },
      {id: "2",
  author: "Jane Smith",
  avatar: ",
  https://via.placeholder.com/40",
  content: "Beautiful day for a hike! Nature is amazing.",
  timestamp: "4 hours ago",
  likes: 42,
  comments: 8,
  shares: 3
      },
      {id: "3",
  author: "Mike Johnson",
  avatar: ",
  https://via.placeholder.com/40",
  content:
          "Just finished reading an incredible book about AI and its future impact.",
  timestamp: "6 hours ago",
  likes: 18,
  comments: 3,
  shares: 1
      }
    ];
    setPosts(mockPosts);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Image source={{uri: item.avatar }} style={styles.avatar} />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{item.author}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <TouchableOpacity style={styles.optionsButton}>
          <Icon name="more-vert" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <Text style={styles.postContent}>{item.content}</Text>

      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="favorite-border" size={20} color="#666" />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="chat-bubble-outline" size={20} color="#666" />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="share" size={20} color="#666" />
          <Text style={styles.actionText}>{item.shares}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Posts</Text>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.createPostButton}>
        <Icon name="edit" size={24} color="#fff" />
        <Text style={styles.createPostText}>Create Post</Text>
      </TouchableOpacity>
    </View>;
  );
};

const styles = StyleSheet.create({container: {,
  flex: 1,
  backgroundColor: "#f5f5f5"
  },
header: {padding: 15,
  backgroundColor: "#fff",
  borderBottomWidth: 1,
  borderBottomColor: "#e0e0e0"
  },
title: {fontSize: 20,
  fontWeight: "bold",
  color: "#333"
  },
postContainer: {backgroundColor: "#fff",
  marginBottom: 10,
  padding: 15,
  elevation: 2,
  shadowColor: "#000",
  shadowOffset: {,
  width: 0,
  height: 1 },
shadowOpacity: 0.1,
shadowRadius: 2
  },
postHeader: {flexDirection: "row",
  alignItems: "center",
  marginBottom: 10
  },
avatar: {width: 40,
  height: 40,
  borderRadius: 20,
  marginRight: 10
  },
authorInfo: {flex: 1
  },
authorName: {fontWeight: "bold",
  fontSize: 14,
  color: "#333"
  },
timestamp: {fontSize: 12,
  color: "#888"
  },
optionsButton: {padding: 5
  },
postContent: {fontSize: 15,
  lineHeight: 20,
  color: "#333",
  marginBottom: 15
  },
postActions: {flexDirection: "row",
  borderTopWidth: 1,
  borderTopColor: "#f0f0f0",
  paddingTop: 10
  },
actionButton: {flex: 1,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 5
  },
actionText: {marginLeft: 5,
  fontSize: 14,
  color: "#666"
  },
createPostButton: {position: "absolute",
  bottom: 20,
  right: 20,
  backgroundColor: "#6200ee",
  width: 50,
  height: 50,
  borderRadius: 25,
  alignItems: "center",
  justifyContent: "center",
  elevation: 8,
  shadowColor: "#000",
  shadowOffset: {,
  width: 0,
  height: 4 },
shadowOpacity: 0.3,
shadowRadius: 4
  },
createPostText: {color: "#fff",
  fontWeight: "bold",
  fontSize: 12
  }
});

export default PostsScreen;
