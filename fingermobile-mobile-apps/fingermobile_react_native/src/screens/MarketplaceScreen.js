import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput
} from "react-native";;
import Icon from "react-native-vector-icons/MaterialIcons";

const MarketplaceScreen = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [categories] = useState([
    {id: 1,
  name: "All" },
    {id: 2,
  name: "Electronics" },
    {id: 3,
  name: "Fashion" },
    {id: 4,
  name: "Home" },
    {id: 5,
  name: "Beauty" },
    {id: 6,
  name: "Sports" }
  ]);

  // Mock product data
  useEffect(() => {
    const mockProducts = [
      {id: "1",
  name: "Wireless Headphones",
  price: 89.99,
  image: ",
  https://via.placeholder.com/150",
  rating: 4.5,
  seller: "Tech Store",
  category: "Electronics"
      },
      {id: "2",
  name: "Summer Dress",
  price: 45.99,
  image: ",
  https://via.placeholder.com/150",
  rating: 4.2,
  seller: "Fashion Hub",
  category: "Fashion"
      },
      {id: "3",
  name: "Coffee Maker",
  price: 65.5,
  image: ",
  https://via.placeholder.com/150",
  rating: 4.7,
  seller: "Home Essentials",
  category: "Home"
      },
      {id: "4",
  name: "Skincare Set",
  price: 32.99,
  image: ",
  https://via.placeholder.com/150",
  rating: 4.3,
  seller: "Beauty World",
  category: "Beauty"
      },
      {id: "5",
  name: "Yoga Mat",
  price: 24.95,
  image: ",
  https://via.placeholder.com/150",
  rating: 4.6,
  seller: "Sports Gear",
  category: "Sports"
      },
      {id: "6",
  name: "Smart Watch",
  price: 199.99,
  image: ",
  https://via.placeholder.com/150",
  rating: 4.8,
  seller: "Tech Store",
  category: "Electronics"
      }
    ];
    setProducts(mockProducts);
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        activeCategory === item.name && styles.activeCategory
      ]}
      onPress={() => setActiveCategory(item.name)}
    >
      <Text
        style={[
          styles.categoryText,
          activeCategory === item.name && styles.activeCategoryText
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>;
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity style={styles.productCard}>
      <Image source={{uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.sellerName}>{item.seller}</Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
          <TouchableOpacity style={styles.addButton}>
            <Icon name="add-shopping-cart" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Marketplace</Text>
        <TouchableOpacity>
          <Icon name="shopping-cart" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesList}
        contentContainerStyle={styles.categoriesListContent}
      />

      {/* Products */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productsContainer}
        columnWrapperStyle={styles.columnWrapper}
      />
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
  paddingTop: 40
  },
title: {fontSize: 24,
  fontWeight: "bold",
  color: "#333"
  },
searchContainer: {flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#fff",
  margin: 15,
  borderRadius: 10,
  paddingHorizontal: 15
  },
searchIcon: {marginRight: 10
  },
searchInput: {flex: 1,
  paddingVertical: 12,
  fontSize: 16,
  color: "#333"
  },
categoriesList: {maxHeight: 50
  },
categoriesListContent: {paddingLeft: 15
  },
categoryItem: {paddingHorizontal: 15,
  paddingVertical: 8,
  marginRight: 10,
  borderRadius: 20,
  backgroundColor: "#e0e0e0"
  },
activeCategory: {backgroundColor: "#6200ee"
  },
categoryText: {fontSize: 14,
  color: "#666"
  },
activeCategoryText: {color: "#fff",
  fontWeight: "bold"
  },
productsContainer: {padding: 10
  },
columnWrapper: {justifyContent: "space-between",
  marginBottom: 10
  },
productCard: {backgroundColor: "#fff",
  borderRadius: 10,
  width: "48%",
  marginBottom: 15,
  overflow: "hidden",
  elevation: 3,
  shadowColor: "#000",
  shadowOffset: {,
  width: 0,
  height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4
  },
productImage: {width: "100%",
  height: 150
  },
productInfo: {padding: 10
  },
productName: {fontSize: 14,
  fontWeight: "bold",
  color: "#333",
  marginBottom: 5
  },
sellerName: {fontSize: 12,
  color: "#888",
  marginBottom: 5
  },
ratingContainer: {flexDirection: "row",
  alignItems: "center",
  marginBottom: 5
  },
ratingText: {fontSize: 12,
  color: "#666",
  marginLeft: 5
  },
priceContainer: {flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 5
  },
productPrice: {fontSize: 16,
  fontWeight: "bold",
  color: "#333"
  },
addButton: {backgroundColor: "#6200ee",
  width: 30,
  height: 30,
  borderRadius: 15,
  alignItems: "center",
  justifyContent: "center"
  }
});

export default MarketplaceScreen;
