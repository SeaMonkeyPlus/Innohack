import { Market } from "@/src/types/market";
import { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

import { LanguageSelector } from "@/src/components/features/language-selector";
import { MarketVerticalList } from "@/src/components/features/market-vertical-list";

// 플랫폼별로 Map 컴포넌트 import
const MapViewComponent =
  Platform.OS === "web"
    ? require("@/src/components/features/map-view/index.web").MapViewComponent
    : require("@/src/components/features/map-view/index.native").MapViewComponent;

// 부산 전통시장 샘플 데이터
const sampleMarkets: Market[] = [
  {
    id: "1",
    name: "국제시장",
    address: "부산광역시 중구 신창동4가 14-1",
    description: "부산의 대표적인 전통시장으로 다양한 먹거리와 물건들이 가득합니다.",
    latitude: 35.0986,
    longitude: 129.0292,
    category: "전통시장",
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800"],
    phone: "051-245-7389",
    openingHours: "09:00 - 20:00",
  },
  {
    id: "2",
    name: "자갈치시장",
    address: "부산광역시 중구 자갈치해안로 52",
    description: "한국 최대의 수산물 시장으로 싱싱한 해산물과 회를 맛볼 수 있습니다.",
    latitude: 35.0966,
    longitude: 129.0306,
    category: "전통시장",
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1534777410147-54lost78309e?w=800"],
    phone: "051-713-8000",
    openingHours: "05:00 - 22:00",
  },
  {
    id: "3",
    name: "부평깡통시장",
    address: "부산광역시 중구 부평1길 36",
    description: "야시장으로 유명하며 다양한 길거리 음식을 즐길 수 있습니다.",
    latitude: 35.0993,
    longitude: 129.0317,
    category: "전통시장",
    rating: 4.4,
    images: ["https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800"],
    phone: "051-245-6594",
    openingHours: "10:00 - 23:00",
  },
  {
    id: "4",
    name: "범일시장",
    address: "부산광역시 동구 범일로 130",
    description: "부산의 전통과 문화가 살아있는 재래시장입니다.",
    latitude: 35.1386,
    longitude: 129.0562,
    category: "전통시장",
    rating: 4.2,
    images: ["https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800"],
    phone: "051-634-3984",
    openingHours: "07:00 - 20:00",
  },
  {
    id: "5",
    name: "깡깡이예술마을시장",
    address: "부산광역시 영도구 절영로 203",
    description: "예술과 전통이 어우러진 독특한 분위기의 시장입니다.",
    latitude: 35.0772,
    longitude: 129.0473,
    category: "전통시장",
    rating: 4.3,
    images: ["https://images.unsplash.com/photo-1542838132-92c53300491e?w=800"],
    phone: "051-418-1863",
    openingHours: "10:00 - 19:00",
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
      <MapViewComponent
        markets={sampleMarkets}
        onMarkerPress={handleMarkerPress}
        selectedMarketId={selectedMarketId}
      />

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
