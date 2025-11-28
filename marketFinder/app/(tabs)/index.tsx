import { Market } from "@/src/types/market";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { LanguageSelector } from "@/src/components/features/language-selector";
import { MarketList } from "@/src/components/features/market-list";
import { ShopList } from "@/src/components/features/shop-list";
import { useSearch } from "@/src/contexts/search-context";
import { fetchMarkets, fetchStoresByMarketId, Shop } from "@/src/services/market-api";

// 플랫폼별로 Map 컴포넌트 import
let MapViewComponent: React.ComponentType<any>;
try {
  MapViewComponent =
    Platform.OS === "web"
      ? require("@/src/components/features/map-view/index.web").MapViewComponent
      : require("@/src/components/features/map-view/index.native").MapViewComponent;
} catch (error) {
  // Fallback for when native maps are not available
  MapViewComponent = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#e0e0e0" }}>
      <Text style={{ fontSize: 16, color: "#666" }}>지도를 불러올 수 없습니다</Text>
      <Text style={{ fontSize: 14, color: "#888", marginTop: 8 }}>웹 버전을 사용해주세요</Text>
    </View>
  );
}

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
    shops: [
      {
        id: "1-1",
        name: "할매 호떡집",
        address: "부산 중구 신창동4가 14-3",
        rating: 4.8,
        category: "떡·디저트",
        description: "30년 전통의 씨앗호떡 전문점",
        images: ["https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=800"],
        latitude: 35.0988,
        longitude: 129.029,
        phone: "051-245-1234",
        openingHours: "09:00 - 19:00",
        menu: [
          { name: "씨앗호떡", price: 2000, description: "해바라기씨, 호박씨 듬뿍" },
          { name: "흑당호떡", price: 2500, description: "달콤한 흑당시럽" },
          { name: "꿀호떡", price: 2000, description: "꿀이 흐르는 호떡" },
          { name: "녹차호떡", price: 2500, description: "고소한 녹차맛" },
        ],
      },
      {
        id: "1-2",
        name: "꿀떡 명가",
        address: "부산 중구 신창동4가 14-2",
        rating: 4.7,
        category: "떡·디저트",
        description: "달콤한 꿀떡 전문점",
        latitude: 35.0987,
        longitude: 129.0291,
        phone: "051-245-9012",
        openingHours: "09:30 - 18:30",
        menu: [
          { name: "꿀호떡", price: 1800, description: "정통 꿀호떡" },
          { name: "시나몬호떡", price: 2000, description: "시나몬 향 가득" },
          { name: "단팥호떡", price: 2000, description: "팥앙금이 듬뿍" },
          { name: "치즈호떡", price: 2500, description: "쭉 늘어나는 치즈" },
        ],
      },
      {
        id: "1-3",
        name: "국제시장 호떡",
        address: "부산 중구 신창동4가 14-8",
        rating: 4.6,
        category: "떡·디저트",
        description: "바삭한 겉과 촉촉한 속의 조화",
        latitude: 35.0989,
        longitude: 129.0293,
        phone: "051-245-7890",
        openingHours: "08:30 - 19:30",
        menu: [
          { name: "전통호떡", price: 1500, description: "옛날 그대로의 맛" },
          { name: "씨앗호떡", price: 2000, description: "견과류 가득" },
          { name: "팥호떡", price: 1800, description: "달콤한 팥앙금" },
        ],
      },
      {
        id: "1-4",
        name: "원조 호떡가게",
        address: "부산 중구 신창동4가 14-10",
        rating: 4.5,
        category: "떡·디저트",
        description: "50년 전통 호떡 맛집",
        latitude: 35.0986,
        longitude: 129.0295,
        phone: "051-245-3333",
        openingHours: "09:00 - 20:00",
        menu: [
          { name: "원조호떡", price: 1500, description: "50년 전통의 맛" },
          { name: "흑설탕호떡", price: 2000, description: "건강한 흑설탕" },
          { name: "크림치즈호떡", price: 3000, description: "부드러운 크림치즈" },
          { name: "야채호떡", price: 2500, description: "신선한 야채 듬뿍" },
        ],
      },
      {
        id: "1-5",
        name: "국제시장 분식",
        address: "부산 중구 신창동4가 14-5",
        rating: 4.6,
        category: "분식",
        description: "비빔당면과 떡볶이가 맛있는 분식집",
        latitude: 35.0984,
        longitude: 129.0294,
        phone: "051-245-5678",
        openingHours: "10:00 - 20:00",
        menu: [
          { name: "떡볶이", price: 4000, description: "매콤달콤한 떡볶이" },
          { name: "비빔당면", price: 5000, description: "쫄깃한 당면" },
          { name: "튀김 (5개)", price: 3000, description: "바삭한 모둠튀김" },
          { name: "순대", price: 5000, description: "찹쌀순대" },
        ],
      },
      {
        id: "1-6",
        name: "부산 어묵 본점",
        address: "부산 중구 신창동4가 14-6",
        rating: 4.5,
        category: "어묵",
        description: "부산 특산 어묵 직판장",
        latitude: 35.0985,
        longitude: 129.0293,
        phone: "051-245-3456",
        openingHours: "08:00 - 20:00",
        menu: [
          { name: "꼬치 어묵", price: 1500, description: "국물 한 그릇 포함" },
          { name: "모듬 어묵", price: 8000, description: "5가지 어묵 모음" },
          { name: "치즈 어묵", price: 2000, description: "치즈가 쏙" },
          { name: "야채 어묵", price: 1500, description: "건강한 야채" },
        ],
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
    shops: [
      {
        id: "2-1",
        name: "해운대 회센터",
        address: "부산 중구 자갈치해안로 54",
        rating: 4.9,
        category: "횟집",
        description: "싱싱한 광어회 전문점",
        images: ["https://images.unsplash.com/photo-1544025162-d76694265947?w=800"],
        latitude: 35.0968,
        longitude: 129.0304,
        phone: "051-713-1111",
        openingHours: "06:00 - 21:00",
      },
      {
        id: "2-2",
        name: "부산 생선구이",
        address: "부산 중구 자갈치해안로 56",
        rating: 4.7,
        category: "생선구이",
        description: "고등어·갈치 구이 전문",
        latitude: 35.0964,
        longitude: 129.0308,
        phone: "051-713-2222",
        openingHours: "07:00 - 20:00",
      },
      {
        id: "2-3",
        name: "자갈치 해물탕",
        address: "부산 중구 자갈치해안로 53",
        rating: 4.8,
        category: "해물탕",
        description: "시원한 국물의 해물탕 전문점",
        latitude: 35.0967,
        longitude: 129.0305,
        phone: "051-713-3333",
        openingHours: "08:00 - 22:00",
      },
      {
        id: "2-4",
        name: "꼬막 전문점",
        address: "부산 중구 자갈치해안로 55",
        rating: 4.6,
        category: "조개·꼬막",
        description: "매콤새콤한 꼬막 무침 전문",
        latitude: 35.0965,
        longitude: 129.0307,
        phone: "051-713-4444",
        openingHours: "09:00 - 20:00",
      },
      {
        id: "2-5",
        name: "해산물 직판장",
        address: "부산 중구 자갈치해안로 57",
        rating: 4.4,
        category: "해산물",
        description: "신선한 멍게와 다양한 해산물",
        latitude: 35.0966,
        longitude: 129.0309,
        phone: "051-713-5555",
        openingHours: "05:00 - 22:00",
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
    shops: [
      {
        id: "3-1",
        name: "부평 닭꼬치",
        address: "부산 중구 부평1길 38",
        rating: 4.5,
        category: "꼬치·야식",
        description: "매콤달콤한 닭꼬치 전문점",
        images: ["https://images.unsplash.com/photo-1588561387991-c4368fc48626?w=800"],
        latitude: 35.0995,
        longitude: 129.0315,
        phone: "051-245-7777",
        openingHours: "17:00 - 01:00",
      },
      {
        id: "3-2",
        name: "깡통시장 분식",
        address: "부산 중구 부평1길 40",
        rating: 4.6,
        category: "분식",
        description: "매콤한 떡볶이와 튀김 전문",
        latitude: 35.0991,
        longitude: 129.0319,
        phone: "051-245-8888",
        openingHours: "10:00 - 23:00",
      },
      {
        id: "3-3",
        name: "야시장 튀김",
        address: "부산 중구 부평1길 39",
        rating: 4.4,
        category: "튀김",
        description: "바삭한 모둠 튀김 전문점",
        latitude: 35.0994,
        longitude: 129.0316,
        phone: "051-245-9999",
        openingHours: "11:00 - 23:30",
      },
      {
        id: "3-4",
        name: "할매 순대국",
        address: "부산 중구 부평1길 41",
        rating: 4.5,
        category: "순대·국밥",
        description: "찹쌀 순대와 순대국 전문",
        latitude: 35.0992,
        longitude: 129.0318,
        phone: "051-245-6666",
        openingHours: "09:00 - 22:00",
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
    shops: [
      {
        id: "4-1",
        name: "범일 돼지국밥",
        address: "부산 동구 범일로 132",
        rating: 4.7,
        category: "국밥",
        description: "진한 국물의 돼지국밥 전문점",
        images: ["https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800"],
        latitude: 35.1388,
        longitude: 129.056,
        phone: "051-634-1111",
        openingHours: "07:00 - 22:00",
      },
      {
        id: "4-2",
        name: "부산 밀면",
        address: "부산 동구 범일로 134",
        rating: 4.5,
        category: "밀면",
        description: "시원한 밀면 전문점",
        latitude: 35.1384,
        longitude: 129.0564,
        phone: "051-634-2222",
        openingHours: "11:00 - 21:00",
      },
      {
        id: "4-3",
        name: "전통 부침개",
        address: "부산 동구 범일로 133",
        rating: 4.3,
        category: "부침개·전",
        description: "바삭한 야채전과 해물전",
        latitude: 35.1387,
        longitude: 129.0561,
        phone: "051-634-3333",
        openingHours: "10:00 - 20:00",
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
    shops: [
      {
        id: "5-1",
        name: "예술가의 베이커리",
        address: "부산 영도구 절영로 205",
        rating: 4.6,
        category: "베이커리",
        description: "예술가의 손맛이 담긴 수제 쿠키",
        images: ["https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800"],
        latitude: 35.0774,
        longitude: 129.0471,
        phone: "051-418-1111",
        openingHours: "10:00 - 19:00",
      },
      {
        id: "5-2",
        name: "깡깡이 수제잼",
        address: "부산 영도구 절영로 207",
        rating: 4.5,
        category: "잼·청",
        description: "신선한 과일로 만든 수제 잼",
        latitude: 35.077,
        longitude: 129.0475,
        phone: "051-418-2222",
        openingHours: "10:30 - 18:30",
      },
      {
        id: "5-3",
        name: "아트 카페",
        address: "부산 영도구 절영로 206",
        rating: 4.7,
        category: "카페",
        description: "예술적인 라떼 아트 카페",
        latitude: 35.0773,
        longitude: 129.0472,
        phone: "051-418-3333",
        openingHours: "09:00 - 21:00",
      },
    ],
  },
];

export default function HomeScreen() {
  const { searchKeyword, clearSearch, selectedMarketId: contextSelectedMarketId, setSelectedMarket } = useSearch();
  const [selectedMarketId, setSelectedMarketId] = useState<string | undefined>(contextSelectedMarketId || undefined);
  const [focusedLocation, setFocusedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [viewMode, setViewMode] = useState<"markets" | "shops">("markets");
  const [sharedListHeight, setSharedListHeight] = useState<number | null>(null);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingShops, setIsLoadingShops] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API에서 시장 데이터 가져오기
  useEffect(() => {
    const loadMarkets = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchMarkets();
        setMarkets(data);
      } catch (err) {
        console.error("Failed to load markets:", err);
        setError("시장 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadMarkets();
  }, []);

  // Context의 선택된 시장 ID와 로컬 상태 동기화
  useEffect(() => {
    if (contextSelectedMarketId) {
      setSelectedMarketId(contextSelectedMarketId);
    }
  }, [contextSelectedMarketId]);

  // 검색 키워드가 있을 때 자동으로 필터링된 가게 표시
  useEffect(() => {
    if (searchKeyword && selectedMarketId) {
      setViewMode("shops");
    }
  }, [searchKeyword, selectedMarketId]);

  const handleMarkerPress = (market: Market) => {
    setSelectedMarketId(market.id);
  };

  const handleSelectMarket = async (market: Market) => {
    setSelectedMarket(market.id);
    setSelectedMarketId(market.id);
    setFocusedLocation({ latitude: market.latitude, longitude: market.longitude });

    // 가게 목록 API 호출
    try {
      setIsLoadingShops(true);
      const storesData = await fetchStoresByMarketId(market.id);
      setShops(storesData);
      setViewMode("shops");
    } catch (err) {
      console.error("Failed to load stores:", err);
      // 가게 목록을 불러오지 못해도 shops 뷰로 전환 (빈 리스트 표시)
      setShops([]);
      setViewMode("shops");
    } finally {
      setIsLoadingShops(false);
    }
  };

  const handleMarketPress = (market: Market) => {
    setFocusedLocation({ latitude: market.latitude, longitude: market.longitude });
  };

  const handleChangeMarket = () => {
    setViewMode("markets");
    setFocusedLocation(null);
  };

  const handleShopPress = (shop: any) => {
    if (shop.latitude && shop.longitude) {
      setFocusedLocation({ latitude: shop.latitude, longitude: shop.longitude });
    }
  };

  const handleBackToMarkets = () => {
    setViewMode("markets");
    setFocusedLocation(null);
    clearSearch();
  };

  const selectedMarket = markets.find((m) => m.id === selectedMarketId);

  // 검색 키워드가 있으면 해당 키워드를 포함하는 가게만 필터링
  const filteredShops = shops.filter((shop) => {
    if (!searchKeyword) return true;

    // 가게 이름, 카테고리, 설명에서 검색 키워드 포함 여부 확인
    const keyword = searchKeyword.toLowerCase();
    const matchesName = shop.name.toLowerCase().includes(keyword);
    const matchesCategory = shop.category?.toLowerCase().includes(keyword);
    const matchesDescription = shop.description?.toLowerCase().includes(keyword);

    return matchesName || matchesCategory || matchesDescription;
  });

  // 로딩 중일 때
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#8B4513" />
        <Text style={styles.loadingText}>시장 정보를 불러오는 중...</Text>
      </View>
    );
  }

  // 에러가 발생했을 때
  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>⚠️</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setIsLoading(true);
            fetchMarkets()
              .then(setMarkets)
              .catch((err) => {
                console.error("Failed to load markets:", err);
                setError("시장 정보를 불러오는데 실패했습니다.");
              })
              .finally(() => setIsLoading(false));
          }}
        >
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Language Selector - Fixed at top left */}
      <View style={styles.languageSelectorContainer}>
        <LanguageSelector />
      </View>

      {/* Selected Market Badge or Change Button - Fixed at top right */}
      {selectedMarket && viewMode === "shops" && (
        <TouchableOpacity style={styles.selectedMarketBadge} onPress={handleChangeMarket} activeOpacity={0.8}>
          <Text style={styles.selectedMarketText}>{selectedMarket.name}</Text>
          <Text style={styles.changeButtonText}>변경</Text>
        </TouchableOpacity>
      )}

      {/* Map */}
      <MapViewComponent
        markets={markets}
        shops={viewMode === "shops" ? shops : []}
        onMarkerPress={handleMarkerPress}
        selectedMarketId={selectedMarketId}
        focusedLocation={focusedLocation}
      />

      {/* List - Market List or Shop List */}
      {viewMode === "markets" ? (
        <MarketList
          markets={markets}
          selectedMarketId={selectedMarketId}
          onMarketPress={handleMarketPress}
          onSelectMarket={handleSelectMarket}
          sharedHeight={sharedListHeight}
          onHeightChange={setSharedListHeight}
        />
      ) : selectedMarket ? (
        isLoadingShops ? (
          <View style={[styles.container, styles.centerContent]}>
            <ActivityIndicator size="large" color="#8B4513" />
            <Text style={styles.loadingText}>가게 정보를 불러오는 중...</Text>
          </View>
        ) : (
          <ShopList
            shops={filteredShops}
            marketName={searchKeyword ? `${selectedMarket.name} - "${searchKeyword}" 검색 결과` : selectedMarket.name}
            onBack={handleBackToMarkets}
            onShopPress={handleShopPress}
            searchKeyword={searchKeyword}
            sharedHeight={sharedListHeight}
            onHeightChange={setSharedListHeight}
          />
        )
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
  selectedMarketBadge: {
    position: "absolute",
    top: 50,
    right: 16,
    zIndex: 1000,
    backgroundColor: "#8B4513",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedMarketText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  changeButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  retryButton: {
    backgroundColor: "#8B4513",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
