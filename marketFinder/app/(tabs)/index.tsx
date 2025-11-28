import RestaurantDetail from "@/src/components/features/restaurant-detail";
import { Restaurant } from "@/src/types/restaurant";
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";

// 예제 데이터
const sampleRestaurant: Restaurant = {
  id: "1",
  name: "맛있는 한식당",
  phone: "02-1234-5678",
  address: "서울특별시 강남구 테헤란로 123",
  description: "정성스럽게 만든 전통 한식을 제공하는 가족 운영 식당입니다. 30년 전통의 맛을 자랑합니다.",
  category: "한식",
  rating: 4.5,
  images: [
    "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=800",
    "https://images.unsplash.com/photo-1580554530778-ca36943938b2?w=800",
    "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800",
  ],
  menuItems: [
    {
      id: "1",
      name: "김치찌개",
      price: 9000,
      description: "매콤하고 시원한 국물 맛이 일품인 김치찌개",
    },
    {
      id: "2",
      name: "된장찌개",
      price: 8000,
      description: "구수한 된장과 신선한 야채로 만든 건강한 찌개",
    },
    {
      id: "3",
      name: "불고기",
      price: 15000,
      description: "부드러운 고기와 달콤한 양념이 어우러진 불고기",
    },
    {
      id: "4",
      name: "비빔밥",
      price: 10000,
      description: "신선한 나물과 고추장이 들어간 영양 만점 비빔밥",
    },
    {
      id: "5",
      name: "삼겹살",
      price: 18000,
      description: "두툼하고 육즙이 풍부한 국내산 삼겹살",
    },
    {
      id: "6",
      name: "냉면",
      price: 11000,
      description: "시원하고 쫄깃한 면발의 물냉면",
    },
  ],
};

export default function HomeScreen() {
  // ============================================
  // 실제 백엔드 API 사용 예시 (주석 처리)
  // ============================================

  // === 방법 1: API 서비스 파일 사용 (권장) ===
  // import { fetchRestaurantById } from "@/src/services/restaurant-api";
  // import { useState, useEffect } from "react";
  // import { ActivityIndicator, Text, View } from "react-native";
  //
  // const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  //
  // useEffect(() => {
  //   loadRestaurantData();
  // }, []);
  //
  // const loadRestaurantData = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //
  //     // restaurantId는 라우트 파라미터나 props로 받아올 수 있습니다
  //     const restaurantId = "1";
  //     const data = await fetchRestaurantById(restaurantId);
  //
  //     setRestaurant(data);
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // === 방법 2: fetch API 직접 사용 ===
  // const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  //
  // useEffect(() => {
  //   fetchRestaurantData();
  // }, []);
  //
  // const fetchRestaurantData = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //
  //     // 백엔드 API 호출 예시
  //     const restaurantId = "1";
  //     const response = await fetch(`https://api.example.com/restaurants/${restaurantId}`);
  //
  //     if (!response.ok) {
  //       throw new Error('음식점 정보를 불러오는데 실패했습니다');
  //     }
  //
  //     const data = await response.json();
  //
  //     // API 응답 데이터를 Restaurant 타입으로 변환
  //     const restaurantData: Restaurant = {
  //       id: data.id,
  //       name: data.name,
  //       phone: data.phone,
  //       address: data.address,
  //       description: data.description,
  //       category: data.category,
  //       rating: data.rating,
  //       images: data.images || [],
  //       menuItems: data.menu_items?.map((item: any) => ({
  //         id: item.id,
  //         name: item.name,
  //         price: item.price,
  //         description: item.description,
  //       })) || [],
  //     };
  //
  //     setRestaurant(restaurantData);
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // 로딩 중일 때
  // if (loading) {
  //   return (
  //     <SafeAreaView style={styles.container}>
  //       <View style={styles.centerContainer}>
  //         <ActivityIndicator size="large" color="#4CAF50" />
  //         <Text style={styles.loadingText}>로딩 중...</Text>
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

  // // 에러가 발생했을 때
  // if (error) {
  //   return (
  //     <SafeAreaView style={styles.container}>
  //       <View style={styles.centerContainer}>
  //         <Text style={styles.errorText}>⚠️ {error}</Text>
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

  // // 데이터가 없을 때
  // if (!restaurant) {
  //   return (
  //     <SafeAreaView style={styles.container}>
  //       <View style={styles.centerContainer}>
  //         <Text style={styles.errorText}>음식점 정보를 찾을 수 없습니다</Text>
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

  // // 정상적으로 데이터를 불러왔을 때
  // return (
  //   <SafeAreaView style={styles.container}>
  //     <RestaurantDetail restaurant={restaurant} />
  //   </SafeAreaView>
  // );

  // ============================================
  // 현재 사용 중: 샘플 데이터
  // ============================================
  return (
    <SafeAreaView style={styles.container}>
      <RestaurantDetail restaurant={sampleRestaurant} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
  },
});
