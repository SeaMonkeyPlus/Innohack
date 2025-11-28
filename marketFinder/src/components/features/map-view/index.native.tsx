import { Market } from "@/src/types/market";
import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";

interface MapViewComponentProps {
  markets: Market[];
  shops?: any[];
  onMarkerPress?: (market: Market) => void;
  selectedMarketId?: string;
  focusedLocation?: { latitude: number; longitude: number } | null;
  userLocation?: { latitude: number; longitude: number } | null;
}

export function MapViewComponent({
  markets,
  shops = [],
  onMarkerPress,
  selectedMarketId,
  focusedLocation,
  userLocation,
}: MapViewComponentProps) {
  const mapRef = useRef<MapView>(null);

  // 초기 위치: 사용자 위치 또는 focusedLocation 또는 부산역
  const getInitialRegion = (): Region => {
    const location = userLocation || focusedLocation;
    if (location) {
      return {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }
    // 기본 위치: 부산역
    return {
      latitude: 35.1156,
      longitude: 129.0403,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  };

  // focusedLocation이 변경되면 지도 이동
  useEffect(() => {
    if (focusedLocation && mapRef.current) {
      // 리스트가 하단 40%를 가리므로, 마커를 보이는 영역(상단 60%)의 중앙에 놓기 위해
      // 위도를 약간 위로 보정
      const latitudeOffset = 0.002;
      mapRef.current.animateToRegion(
        {
          latitude: focusedLocation.latitude + latitudeOffset,
          longitude: focusedLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  }, [focusedLocation]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={getInitialRegion()}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        showsBuildings={false}
        showsTraffic={false}
        showsIndoors={false}
        showsPointsOfInterests={false}
        mapType="standard"
        toolbarEnabled={false}
      >
        {/* 사용자 위치 마커 */}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="My Location"
            zIndex={999}
          >
            <View style={styles.userMarkerContainer}>
              <View style={styles.userMarkerOuter}>
                <View style={styles.userMarkerInner} />
              </View>
            </View>
          </Marker>
        )}

        {/* 시장 마커 */}
        {markets.map((market) => {
          const isSelected = selectedMarketId === market.id;
          return (
            <Marker
              key={market.id}
              coordinate={{
                latitude: market.latitude,
                longitude: market.longitude,
              }}
              title={market.name}
              onPress={() => onMarkerPress?.(market)}
              zIndex={isSelected ? 1000 : 1}
            >
              <View style={styles.markerContainer}>
                <View style={styles.markerLabel}>
                  <Text style={styles.markerLabelText}>{market.name}</Text>
                </View>
                <View style={[styles.markerPin, isSelected && styles.selectedMarkerPin]}>
                  <Text style={styles.markerEmoji}>📍</Text>
                </View>
              </View>
            </Marker>
          );
        })}

        {/* 가게 마커 */}
        {shops.map((shop) => (
          <Marker
            key={`shop-${shop.id}`}
            coordinate={{
              latitude: shop.latitude,
              longitude: shop.longitude,
            }}
            title={shop.name}
            zIndex={10}
          >
            <View style={styles.shopMarkerContainer}>
              <View style={styles.shopMarkerPin}>
                <Text style={styles.shopMarkerEmoji}>🏪</Text>
              </View>
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  markerContainer: {
    alignItems: "center",
  },
  markerLabel: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#333333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 4,
  },
  markerLabelText: {
    color: "#000000",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  markerPin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  selectedMarkerPin: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4CAF50",
    borderWidth: 3,
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  markerEmoji: {
    fontSize: 24,
  },
  userMarkerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  userMarkerOuter: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(66, 133, 244, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4285F4",
  },
  userMarkerInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#4285F4",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  shopMarkerContainer: {
    alignItems: "center",
  },
  shopMarkerPin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  shopMarkerEmoji: {
    fontSize: 20,
  },
});
