import { Market } from "@/src/types/market";
import { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

import { LanguageSelector } from "@/src/components/features/language-selector";
import { MarketList } from "@/src/components/features/market-list";
import { ProductList } from "@/src/components/features/product-list";

// 플랫폼별로 Map 컴포넌트 import
const MapViewComponent =
  Platform.OS === "web"
    ? require("@/src/components/features/map-view/index.web").MapViewComponent
    : require("@/src/components/features/map-view/index.native").MapViewComponent;

// 부산 전통시장 샘플 데이터 (products 포함)
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
    products: [
      {
        id: "1-1",
        name: "씨앗호떡",
        price: 1500,
        rating: 4.8,
        category: "간식",
        description: "바삭한 겉면과 달콤한 속이 일품인 호떡",
        images: ["https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=800"],
      },
      {
        id: "1-2",
        name: "비빔당면",
        price: 5000,
        rating: 4.6,
        category: "식사",
        description: "매콤달콤한 양념이 일품인 당면 요리",
      },
      {
        id: "1-3",
        name: "꿀떡",
        price: 2000,
        rating: 4.7,
        category: "간식",
        description: "달콤한 꿀이 가득한 떡",
      },
      {
        id: "1-4",
        name: "어묵",
        price: 3000,
        rating: 4.5,
        category: "간식",
        description: "부산 특산 어묵",
      },
    ],
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
    products: [
      {
        id: "2-1",
        name: "광어회",
        price: 35000,
        rating: 4.9,
        category: "회",
        description: "싱싱한 광어 한 마리",
        images: ["https://images.unsplash.com/photo-1544025162-d76694265947?w=800"],
      },
      {
        id: "2-2",
        name: "고등어구이",
        price: 8000,
        rating: 4.7,
        category: "구이",
        description: "고소한 고등어 구이",
      },
      {
        id: "2-3",
        name: "해물탕",
        price: 25000,
        rating: 4.8,
        category: "탕",
        description: "시원한 국물의 해물탕",
      },
      {
        id: "2-4",
        name: "꼬막무침",
        price: 12000,
        rating: 4.6,
        category: "반찬",
        description: "매콤새콤한 꼬막 무침",
      },
      {
        id: "2-5",
        name: "멍게",
        price: 15000,
        rating: 4.4,
        category: "해산물",
        description: "신선한 멍게",
      },
    ],
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
    products: [
      {
        id: "3-1",
        name: "닭꼬치",
        price: 2000,
        rating: 4.5,
        category: "간식",
        description: "매콤달콤한 닭꼬치",
        images: ["https://images.unsplash.com/photo-1588561387991-c4368fc48626?w=800"],
      },
      {
        id: "3-2",
        name: "떡볶이",
        price: 3500,
        rating: 4.6,
        category: "간식",
        description: "매콤한 떡볶이",
      },
      {
        id: "3-3",
        name: "튀김",
        price: 3000,
        rating: 4.4,
        category: "간식",
        description: "바삭한 모둠 튀김",
      },
      {
        id: "3-4",
        name: "순대",
        price: 4000,
        rating: 4.5,
        category: "간식",
        description: "찹쌀 순대",
      },
    ],
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
    products: [
      {
        id: "4-1",
        name: "돼지국밥",
        price: 8000,
        rating: 4.7,
        category: "식사",
        description: "진한 국물의 돼지국밥",
        images: ["https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800"],
      },
      {
        id: "4-2",
        name: "밀면",
        price: 7000,
        rating: 4.5,
        category: "식사",
        description: "시원한 밀면",
      },
      {
        id: "4-3",
        name: "야채전",
        price: 5000,
        rating: 4.3,
        category: "반찬",
        description: "바삭한 야채전",
      },
    ],
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
    products: [
      {
        id: "5-1",
        name: "수제 쿠키",
        price: 5000,
        rating: 4.6,
        category: "디저트",
        description: "예술가의 손맛이 담긴 쿠키",
        images: ["https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800"],
      },
      {
        id: "5-2",
        name: "수제 잼",
        price: 8000,
        rating: 4.5,
        category: "잼",
        description: "신선한 과일로 만든 수제 잼",
      },
      {
        id: "5-3",
        name: "아트 커피",
        price: 4500,
        rating: 4.7,
        category: "음료",
        description: "예술적인 라떼 아트",
      },
    ],
  },
];

export default function HomeScreen() {
  const [selectedMarketId, setSelectedMarketId] = useState<string | undefined>(undefined);
  const [focusedMarket, setFocusedMarket] = useState<Market | null>(null);
  const [isListMinimized, setIsListMinimized] = useState(false);
  const [viewMode, setViewMode] = useState<"markets" | "products">("markets");

  const handleMarkerPress = (market: Market) => {
    setSelectedMarketId(market.id);
    setIsListMinimized(false);
  };

  const handleMarketPress = (market: Market) => {
    setSelectedMarketId(market.id);
    setFocusedMarket(market);
    setViewMode("products");
    setIsListMinimized(false);
  };

  const handleBackToMarkets = () => {
    setViewMode("markets");
    setFocusedMarket(null);
    setIsListMinimized(false);
  };

  const handleToggleMinimize = () => {
    setIsListMinimized(!isListMinimized);
  };

  const selectedMarket = sampleMarkets.find((m) => m.id === selectedMarketId);

  return (
    <View style={styles.container}>
      {/* Language Selector - Fixed at top left */}
      <View style={styles.languageSelectorContainer}>
        <LanguageSelector />
      </View>

      {/* Map */}
      <MapViewComponent
        markets={sampleMarkets}
        onMarkerPress={handleMarkerPress}
        selectedMarketId={selectedMarketId}
        focusedMarket={focusedMarket}
      />

      {/* List - Market List or Product List */}
      {viewMode === "markets" ? (
        <MarketList
          markets={sampleMarkets}
          selectedMarketId={selectedMarketId}
          onMarketPress={handleMarketPress}
          isMinimized={isListMinimized}
          onToggleMinimize={handleToggleMinimize}
        />
      ) : selectedMarket ? (
        <ProductList
          products={selectedMarket.products}
          marketName={selectedMarket.name}
          onBack={handleBackToMarkets}
          isMinimized={isListMinimized}
          onToggleMinimize={handleToggleMinimize}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  languageSelectorContainer: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 1000,
  },
});
