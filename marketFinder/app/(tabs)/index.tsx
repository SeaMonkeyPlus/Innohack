import { Market } from "@/src/types/market";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Location from "expo-location";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const MIN_HEIGHT = SCREEN_HEIGHT * 0.1;

import { LanguageSelector } from "@/src/components/features/language-selector";
import { MarketList } from "@/src/components/features/market-list";
import { ShopList } from "@/src/components/features/shop-list";
import { useLanguage } from "@/src/contexts/language-context";
import { useSearch } from "@/src/contexts/search-context";
import { useTranslation } from "@hooks/use-translation";
import { fetchMarkets, fetchStoresByMarketId, Shop } from "@/src/services/market-api";
import { calculateDistance } from "@/src/utils/distance";
import React from "react";

// 플랫폼별로 Map 컴포넌트 import
let MapViewComponent: React.ComponentType<any>;
try {
  MapViewComponent =
    Platform.OS === "web"
      ? require("@/src/components/features/map-view/index.web").MapViewComponent
      : require("@/src/components/features/map-view/index.native").MapViewComponent;
} catch (error) {
  // Fallback for when native maps are not available
  MapViewComponent = () => {
    const { t } = useTranslation();
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#e0e0e0" }}>
        <Text style={{ fontSize: 16, color: "#666" }}>{t.market.mapLoadFailed}</Text>
        <Text style={{ fontSize: 14, color: "#888", marginTop: 8 }}>{t.market.useWeb}</Text>
      </View>
    );
  };
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();
  const {
    searchKeyword,
    clearSearch,
    selectedMarketId: contextSelectedMarketId,
    setSelectedMarket,
    predictResult,
  } = useSearch();
  const [selectedMarketId, setSelectedMarketId] = useState<string | undefined>(contextSelectedMarketId || undefined);
  const [focusedLocation, setFocusedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [viewMode, setViewMode] = useState<"markets" | "shops">("markets");
  const [sharedListHeight, setSharedListHeight] = useState<number | null>(null);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingShops, setIsLoadingShops] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // 사용자 현재 위치 가져오기
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Location permission not granted");
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const userPos = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(userPos);

        // 앱 시작 시 사용자 위치를 중심으로 설정
        if (!focusedLocation) {
          setFocusedLocation(userPos);
        }
      } catch (error) {
        console.error("Failed to get user location:", error);
      }
    };

    getUserLocation();
  }, []);

  // API에서 시장 데이터 가져오기
  useEffect(() => {
    const loadMarkets = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchMarkets(selectedLanguage.code);
        setMarkets(data);
      } catch (err) {
        console.error("Failed to load markets:", err);
        setError(t.market.loadFailed);
      } finally {
        setIsLoading(false);
      }
    };

    loadMarkets();
  }, [selectedLanguage.code]);

  // Context의 선택된 시장 ID와 로컬 상태 동기화 및 가게 목록 자동 로드
  useEffect(() => {
    if (contextSelectedMarketId && markets.length > 0) {
      // 저장된 시장 ID가 현재 시장 목록에 존재하는지 확인
      const marketExists = markets.some((m) => m.id === contextSelectedMarketId);

      if (!marketExists) {
        // 시장이 존재하지 않으면 선택 해제 및 AsyncStorage 초기화
        console.log("Saved market no longer exists, clearing selection");
        setSelectedMarket(""); // 빈 문자열로 설정하여 초기화
        return;
      }

      setSelectedMarketId(contextSelectedMarketId);

      // 저장된 시장이 있으면 자동으로 해당 시장의 가게 목록 로드
      const loadStoresForSavedMarket = async () => {
        try {
          setIsLoadingShops(true);
          const storesData = await fetchStoresByMarketId(contextSelectedMarketId, selectedLanguage.code);
          setShops(storesData);
          setViewMode("shops");
        } catch (err) {
          console.error("Failed to load stores for saved market:", err);
          // 가게 목록 로드 실패 시에도 markets 뷰 유지
        } finally {
          setIsLoadingShops(false);
        }
      };

      loadStoresForSavedMarket();
    }
  }, [contextSelectedMarketId, markets]);

  // 예측 결과가 있을 때 가게 목록 설정
  useEffect(() => {
    if (predictResult && predictResult.shops) {
      const isEnglish = selectedLanguage.code === "en";

      // PredictShop을 Shop으로 변환
      const convertedShops: Shop[] = predictResult.shops.map((shop) => ({
        id: shop.store_id.toString(),
        name: isEnglish && shop.name_en ? shop.name_en : shop.store_name,
        address: isEnglish && shop.address_en ? shop.address_en : shop.address,
        rating: 0,
        description: `${
          isEnglish && shop.menus?.[0]?.name_en ? shop.menus[0].name_en : shop.menu_name
        } - ${shop.menu_price.toLocaleString()}${t.common.won}`,
        images: shop.image_url ? [shop.image_url] : [],
        latitude: Number(shop.lat),
        longitude: Number(shop.lon),
        phone: undefined,
        openingHours: undefined,
      }));

      setShops(convertedShops);
      setViewMode("shops");
    } else if (predictResult === null && searchKeyword === null) {
      // predictResult와 searchKeyword가 모두 null이면 (clearSearch 호출 후)
      // 시장의 전체 가게 목록을 로드
      if (selectedMarketId) {
        const loadAllStores = async () => {
          try {
            setIsLoadingShops(true);
            const storesData = await fetchStoresByMarketId(selectedMarketId, selectedLanguage.code);
            setShops(storesData);
          } catch (err) {
            console.error("Failed to load all stores:", err);
            setShops([]);
          } finally {
            setIsLoadingShops(false);
          }
        };
        loadAllStores();
      }
    }
  }, [predictResult, searchKeyword, selectedMarketId]);

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
      const storesData = await fetchStoresByMarketId(market.id, selectedLanguage.code);
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
    clearSearch(); // 검색 정보 초기화
    setViewMode("markets");
    setFocusedLocation(null);
  };

  const handleShopPress = (shop: any) => {
    if (shop.latitude && shop.longitude) {
      setFocusedLocation({ latitude: shop.latitude, longitude: shop.longitude });
    }
  };

  const handleBackToMarkets = () => {
    clearSearch(); // 검색 정보 초기화
    setViewMode("markets"); // 시장 선택 페이지로 이동
    setFocusedLocation(null);
  };

  const selectedMarket = markets.find((m) => m.id === selectedMarketId);

  // 사용자 위치 기준으로 시장을 가까운 순서로 정렬
  const sortedMarkets = React.useMemo(() => {
    if (!userLocation) return markets;

    return [...markets].sort((a, b) => {
      const distanceA = calculateDistance(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude);
      const distanceB = calculateDistance(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude);
      return distanceA - distanceB;
    });
  }, [markets, userLocation]);

  // 내 위치로 이동 핸들러
  const handleGoToMyLocation = () => {
    if (userLocation) {
      setFocusedLocation(userLocation);
    }
  };

  // 검색 키워드가 있으면 해당 키워드를 포함하는 가게만 필터링하고, 내 위치와 가까운 순으로 정렬
  const filteredShops = React.useMemo(() => {
    // 먼저 검색 키워드로 필터링
    let filtered = shops.filter((shop) => {
      if (!searchKeyword) return true;

      // 가게 이름, 카테고리, 설명에서 검색 키워드 포함 여부 확인
      const keyword = searchKeyword.toLowerCase();
      const matchesName = shop.name.toLowerCase().includes(keyword);
      const matchesCategory = shop.category?.toLowerCase().includes(keyword);
      const matchesDescription = shop.description?.toLowerCase().includes(keyword);

      return matchesName || matchesCategory || matchesDescription;
    });

    // 사용자 위치가 있으면 거리 기준으로 정렬
    if (userLocation && filtered.length > 0) {
      filtered = [...filtered].sort((a, b) => {
        const distanceA = calculateDistance(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude);
        const distanceB = calculateDistance(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude);
        return distanceA - distanceB;
      });
    }

    return filtered;
  }, [shops, searchKeyword, userLocation]);

  // 로딩 중일 때
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#8B4513" />
        <Text style={styles.loadingText}>{t.market.loadingMarkets}</Text>
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
            fetchMarkets(selectedLanguage.code)
              .then(setMarkets)
              .catch((err) => {
                console.error("Failed to load markets:", err);
                setError(t.market.loadFailed);
              })
              .finally(() => setIsLoading(false));
          }}
        >
          <Text style={styles.retryButtonText}>{t.market.retry}</Text>
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
          <Text style={styles.changeButtonText}>{t.market.change}</Text>
        </TouchableOpacity>
      )}

      {/* 내 위치로 이동 버튼 - 시장 변경 버튼 아래 */}
      {userLocation && (
        <TouchableOpacity
          style={[
            styles.myLocationButton,
            viewMode === "shops" ? styles.myLocationButtonWithMarket : styles.myLocationButtonNoMarket,
          ]}
          onPress={handleGoToMyLocation}
          activeOpacity={0.8}
        >
          <Text style={styles.myLocationIcon}>📍</Text>
        </TouchableOpacity>
      )}

      {/* Map */}
      <MapViewComponent
        markets={viewMode === "shops" ? [] : markets}
        shops={viewMode === "shops" ? filteredShops : []}
        onMarkerPress={handleMarkerPress}
        selectedMarketId={selectedMarketId}
        focusedLocation={focusedLocation}
        userLocation={userLocation}
      />

      {/* List - Market List or Shop List */}
      {viewMode === "markets" ? (
        <MarketList
          markets={sortedMarkets}
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
            <Text style={styles.loadingText}>{t.market.loadingShops}</Text>
          </View>
        ) : (
          <ShopList
            shops={filteredShops}
            marketName={
              searchKeyword
                ? `${selectedMarket.name} - "${searchKeyword}" ${t.market.searchResults}`
                : selectedMarket.name
            }
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
  myLocationButton: {
    position: "absolute",
    right: 16,
    zIndex: 1001,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4285F4",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  myLocationButtonWithMarket: {
    top: 110,
  },
  myLocationButtonNoMarket: {
    top: 50,
  },
  myLocationIcon: {
    fontSize: 28,
  },
});
