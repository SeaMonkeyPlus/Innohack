import { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import RestaurantDetail from "@/src/components/features/restaurant-detail";
import { Restaurant } from "@/src/types/restaurant";
import { LanguageSelector } from "@components/features/language-selector";
import { MapViewComponent } from "@components/features/map-view";

// 예제 음식점 데이터
const sampleRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "맛있는 한식당",
    phone: "02-1234-5678",
    address: "서울특별시 강남구 테헤란로 123",
    description: "정성스럽게 만든 전통 한식을 제공하는 가족 운영 식당입니다.",
    category: "한식",
    rating: 4.5,
    images: [
      "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=800",
      "https://images.unsplash.com/photo-1580554530778-ca36943938b2?w=800",
    ],
    menuItems: [
      { id: "1", name: "김치찌개", price: 9000, description: "매콤하고 시원한 국물 맛" },
      { id: "2", name: "된장찌개", price: 8000, description: "구수한 된장 찌개" },
      { id: "3", name: "불고기", price: 15000, description: "부드러운 불고기" },
    ],
  },
  {
    id: "2",
    name: "이탈리안 레스토랑",
    phone: "02-2345-6789",
    address: "서울특별시 강남구 역삼동 456",
    description: "정통 이탈리안 요리를 선보입니다.",
    category: "양식",
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"],
    menuItems: [
      { id: "1", name: "까르보나라", price: 18000, description: "크림 파스타" },
      { id: "2", name: "마르게리타 피자", price: 22000, description: "클래식 피자" },
    ],
  },
];

export default function HomeScreen() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowDetailModal(true);
  };

  const closeModal = () => {
    setShowDetailModal(false);
  };

  return (
    <View style={styles.container}>
      {/* Language Selector - Fixed at top left */}
      <View style={styles.languageSelectorContainer}>
        <LanguageSelector />
      </View>

      {/* Google Map */}
      <MapViewComponent />

      {/* Restaurant List Button - Fixed at bottom */}
      <View style={styles.restaurantListContainer}>
        <Text style={styles.listTitle}>주변 음식점</Text>
        {sampleRestaurants.map((restaurant) => (
          <TouchableOpacity
            key={restaurant.id}
            style={styles.restaurantCard}
            onPress={() => handleRestaurantSelect(restaurant)}
          >
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <Text style={styles.restaurantCategory}>{restaurant.category}</Text>
              <Text style={styles.restaurantRating}>⭐ {restaurant.rating}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Restaurant Detail Modal */}
      <Modal visible={showDetailModal} animationType="slide" onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>✕ 닫기</Text>
          </TouchableOpacity>
          {selectedRestaurant && <RestaurantDetail restaurant={selectedRestaurant} />}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  languageSelectorContainer: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 1000,
  },
  restaurantListContainer: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: 200,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  restaurantCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  restaurantInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  restaurantCategory: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  restaurantRating: {
    fontSize: 14,
    color: "#FFA500",
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 16,
    zIndex: 1000,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
