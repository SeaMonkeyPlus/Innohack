import React from "react";
import { Dimensions, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Restaurant } from "../../types/restaurant";

const { width } = Dimensions.get("window");

interface RestaurantDetailProps {
  restaurant: Restaurant;
}

export default function RestaurantDetail({ restaurant }: RestaurantDetailProps) {
  const handleCallPress = () => {
    Linking.openURL(`tel:${restaurant.phone}`);
  };

  const formatPrice = (price: number) => {
    return `₩${price.toLocaleString()}`;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 가게 사진 */}
      {restaurant.images.length > 0 && (
        <View style={styles.imageContainer}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.imageScroller}>
            {restaurant.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.restaurantImage} resizeMode="cover" />
            ))}
          </ScrollView>
        </View>
      )}

      {/* 가게 기본 정보 */}
      <View style={styles.infoSection}>
        <View style={styles.headerRow}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          {restaurant.rating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>⭐ {restaurant.rating}</Text>
            </View>
          )}
        </View>

        {restaurant.category && <Text style={styles.categoryText}>{restaurant.category}</Text>}

        {restaurant.description && <Text style={styles.descriptionText}>{restaurant.description}</Text>}

        {/* 전화번호 */}
        <TouchableOpacity style={styles.phoneButton} onPress={handleCallPress}>
          <Text style={styles.phoneIcon}>📞</Text>
          <Text style={styles.phoneText}>{restaurant.phone}</Text>
        </TouchableOpacity>

        {/* 주소 */}
        {restaurant.address && (
          <View style={styles.addressContainer}>
            <Text style={styles.addressIcon}>📍</Text>
            <Text style={styles.addressText}>{restaurant.address}</Text>
          </View>
        )}
      </View>

      {/* 메뉴 리스트 */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>메뉴</Text>
        {restaurant.menuItems.map((item) => (
          <View key={item.id} style={styles.menuItem}>
            <View style={styles.menuItemHeader}>
              <Text style={styles.menuItemName}>{item.name}</Text>
              <Text style={styles.menuItemPrice}>{formatPrice(item.price)}</Text>
            </View>
            {item.description && <Text style={styles.menuItemDescription}>{item.description}</Text>}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    width: "100%",
    height: 250,
    backgroundColor: "#f0f0f0",
  },
  imageScroller: {
    width: "100%",
    height: "100%",
  },
  restaurantImage: {
    width: width,
    height: 250,
  },
  infoSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  ratingContainer: {
    backgroundColor: "#fff3cd",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 10,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#856404",
  },
  categoryText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
    marginBottom: 16,
  },
  phoneButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 12,
  },
  phoneIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  phoneText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f8f9fa",
    padding: 14,
    borderRadius: 10,
  },
  addressIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  addressText: {
    fontSize: 15,
    color: "#555",
    flex: 1,
    lineHeight: 22,
  },
  menuSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  menuItem: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  menuItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  menuItemPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginLeft: 12,
  },
  menuItemDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
