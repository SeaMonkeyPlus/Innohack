import { Market } from "@/src/types/market";
import { useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import { LanguageSelector } from "@/src/components/features/language-selector";
import { MarketVerticalList } from "@/src/components/features/market-vertical-list";

// 플랫폼별로 Map 컴포넌트 import
const MapViewComponent =
  Platform.OS === "web"
    ? require("@/src/components/features/map-view/index.web").MapViewComponent
    : require("@/src/components/features/map-view/index.native").MapViewComponent;

// 전통시장 샘플 데이터
const sampleMarkets: Market[] = [
  {
    id: "1",
    name: "광장시장",
    address: "서울특별시 종로구 창경궁로 88",
    description: "서울의 대표적인 전통시장으로 빈대떡, 마약김밥 등이 유명합니다.",
    latitude: 37.5707,
    longitude: 126.9999,
    category: "전통시장",
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800"],
    phone: "02-2267-0291",
    openingHours: "09:00 - 19:00",
  },
  {
    id: "2",
    name: "남대문시장",
    address: "서울특별시 중구 남대문시장4길 21",
    description: "600년 역사를 자랑하는 한국 최대 규모의 전통시장입니다.",
    latitude: 37.5586,
    longitude: 126.9776,
    category: "전통시장",
    rating: 4.3,
    images: ["https://images.unsplash.com/photo-1534777410147-54lost78309e?w=800"],
    phone: "02-753-2805",
    openingHours: "10:00 - 20:00",
  },
  {
    id: "3",
    name: "통인시장",
    address: "서울특별시 종로구 자하문로15길 18",
    description: "도시락 카페로 유명한 전통시장입니다.",
    latitude: 37.5794,
    longitude: 126.9690,
    category: "전통시장",
    rating: 4.2,
    images: ["https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800"],
    phone: "02-722-0911",
    openingHours: "08:00 - 22:00",
  },
  {
    id: "4",
    name: "망원시장",
    address: "서울특별시 마포구 포은로8길 14",
    description: "젊은이들에게 인기 있는 핫플레이스 전통시장입니다.",
    latitude: 37.5558,
    longitude: 126.9100,
    category: "전통시장",
    rating: 4.4,
    images: ["https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800"],
    phone: "02-335-2107",
    openingHours: "06:00 - 21:00",
  },
  {
    id: "5",
    name: "중부시장",
    address: "서울특별시 중구 을지로36길 20",
    description: "건어물과 한약재로 유명한 도심 속 전통시장입니다.",
    latitude: 37.5640,
    longitude: 126.9999,
    category: "전통시장",
    rating: 4.1,
    images: ["https://images.unsplash.com/photo-1542838132-92c53300491e?w=800"],
    phone: "02-2254-4645",
    openingHours: "05:00 - 19:00",
  },
];

export default function HomeScreen() {
  const [selectedMarketId, setSelectedMarketId] = useState<string | undefined>(undefined);
  const [isListMinimized, setIsListMinimized] = useState(false);

  const handleMarkerPress = (market: Market) => {
    setSelectedMarketId(market.id);
    setIsListMinimized(false); // 마커 클릭시 리스트 열기
  };

  const handleMarketPress = (market: Market) => {
    setSelectedMarketId(market.id);
  };

  const handleMarketDetailPress = (market: Market) => {
    // TODO: 상세 정보 모달 열기
    console.log("상세 정보:", market.name);
  };

  const handleToggleMinimize = () => {
    setIsListMinimized(!isListMinimized);
  };

  return (
    <View style={styles.container}>
      {/* Language Selector - Fixed at top left */}
      <View style={styles.languageSelectorContainer}>
        <LanguageSelector />
      </View>

      {/* Map - 웹과 네이티브 모두 표시 */}
      {Platform.OS === "web" ? (
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>🗺️</Text>
          <Text style={styles.mapPlaceholderSubtext}>지도 보기</Text>
          <Text style={styles.mapPlaceholderNote}>(웹에서는 Google Maps API 키가 필요합니다)</Text>
        </View>
      ) : (
        <MapViewComponent
          markets={sampleMarkets}
          onMarkerPress={handleMarkerPress}
          selectedMarketId={selectedMarketId}
        />
      )}

      {/* Market Vertical List - Fixed at bottom */}
      <MarketVerticalList
        markets={sampleMarkets}
        selectedMarketId={selectedMarketId}
        onMarketPress={handleMarketPress}
        onMarketDetailPress={handleMarketDetailPress}
        isMinimized={isListMinimized}
        onToggleMinimize={handleToggleMinimize}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e8f4f8",
    padding: 20,
  },
  mapPlaceholderText: {
    fontSize: 64,
    marginBottom: 16,
  },
  mapPlaceholderSubtext: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  mapPlaceholderNote: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  languageSelectorContainer: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 1000,
  },
});
