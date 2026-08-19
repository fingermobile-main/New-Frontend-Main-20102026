import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert
} from "react-native";;
import Icon from "react-native-vector-icons/MaterialIcons";

const ProfileScreen = () => {
  const [profileData, setProfileData] = useState({name: "John Doe",
  membername: "@johndoe",
  bio: "Digital creator and tech enthusiast. Love to share my experiences with the community.",
  followers: 1234,
  following: 567,
  posts: 89,
  isFollowing: false
  });

  const toggleFollow = () => {
    setProfileData((prev) => ({
      ...prev,
isFollowing: !prev.isFollowing
    }));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{uri: ",
  https://via.placeholder.com/120" }}
          style={styles.profileImage}
        />

        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{profileData.name}</Text>
          <Text style={styles.profilemembername}>{profileData.membername}</Text>
          <Text style={styles.profileBio}>{profileData.bio}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{profileData.posts}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{profileData.followers}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{profileData.following}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[
            styles.button,
            profileData.isFollowing
              ? styles.,
followingButton
              : styles.followButton
          ]}
          onPress={toggleFollow}
        >
          <Text style={styles.buttonText}>
            {profileData.isFollowing ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.messageButton}>
          <Icon name="message" size={20} color="#fff" />
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={styles.tabButton}>
          <Icon name="grid-on" size={24} color="#6200ee" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Icon name="video-call" size={24} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Icon name="person" size={24} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Posts Grid */}
      <View style={styles.postsGrid}>
        <View style={styles.gridRow}>
          <Image
            source={{uri: ",
  https://via.placeholder.com/120" }}
            style={styles.gridImage}
          />
          <Image
            source={{uri: ",
  https://via.placeholder.com/120" }}
            style={styles.gridImage}
          />
          <Image
            source={{uri: ",
  https://via.placeholder.com/120" }}
            style={styles.gridImage}
          />
        </View>
        <View style={styles.gridRow}>
          <Image
            source={{uri: ",
  https://via.placeholder.com/120" }}
            style={styles.gridImage}
          />
          <Image
            source={{uri: ",
  https://via.placeholder.com/120" }}
            style={styles.gridImage}
          />
          <Image
            source={{uri: ",
  https://via.placeholder.com/120" }}
            style={styles.gridImage}
          />
        </View>
      </View>
    </ScrollView>;
  );
};

const styles = StyleSheet.create({container: {,
  flex: 1,
  backgroundColor: "#fff"
  },
profileHeader: {flexDirection: "row",
  padding: 20,
  alignItems: "center"
  },
profileImage: {width: 100,
  height: 100,
  borderRadius: 50,
  marginRight: 15
  },
profileInfo: {flex: 1
  },
profileName: {fontSize: 22,
  fontWeight: "bold",
  color: "#333"
  },
profilemembername: {fontSize: 16,
  color: "#6200ee",
  marginVertical: 5
  },
profileBio: {fontSize: 14,
  color: "#666",
  lineHeight: 18
  },
statsContainer: {flexDirection: "row",
  justifyContent: "space-around",
  paddingVertical: 15,
  borderTopWidth: 1,
  borderTopColor: "#eee",
  borderBottomWidth: 1,
  borderBottomColor: "#eee"
  },
statItem: {alignItems: "center"
  },
statNumber: {fontSize: 18,
  fontWeight: "bold",
  color: "#333"
  },
statLabel: {fontSize: 14,
  color: "#666",
  marginTop: 3
  },
actionButtons: {flexDirection: "row",
  padding: 15
  },
button: {flex: 1,
  paddingVertical: 10,
  borderRadius: 5,
  alignItems: "center",
  marginRight: 10
  },
followButton: {backgroundColor: "#6200ee"
  },
followingButton: {backgroundColor: "#e0e0e0"
  },
messageButton: {flex: 1,
  paddingVertical: 10,
  borderRadius: 5,
  backgroundColor: "#6200ee",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center"
  },
buttonText: {color: "#fff",
  fontWeight: "bold"
  },
messageButtonText: {color: "#fff",
  fontWeight: "bold",
  marginLeft: 5
  },
tabsContainer: {flexDirection: "row",
  justifyContent: "space-around",
  paddingVertical: 15,
  borderBottomWidth: 1,
  borderBottomColor: "#eee"
  },
tabButton: {flex: 1,
  alignItems: "center"
  },
postsGrid: {padding: 1
  },
gridRow: {flexDirection: "row"
  },
gridImage: {flex: 1,
  height: 120,
  margin: 1
  }
});

export default ProfileScreen;
