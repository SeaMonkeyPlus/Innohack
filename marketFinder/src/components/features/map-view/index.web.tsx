import { Market } from "@/src/types/market";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useLanguage } from "../../../contexts/language-context";

interface Shop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  [key: string]: any;
}

interface MapViewComponentProps {
  markets: Market[];
  shops?: Shop[];
  onMarkerPress?: (market: Market) => void;
  selectedMarketId?: string;
  focusedLocation?: { latitude: number; longitude: number } | null;
  userLocation?: { latitude: number; longitude: number } | null;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

export function MapViewComponent({
  markets,
  shops = [],
  onMarkerPress,
  selectedMarketId,
  focusedLocation,
  userLocation,
}: MapViewComponentProps) {
  const { selectedLanguage } = useLanguage();
  const [mapKey, setMapKey] = useState(0);
  const mapRef = useRef<google.maps.Map | null>(null);

  // 초기 위치: 사용자 위치 또는 focusedLocation 또는 부산역
  const getInitialCenter = () => {
    const location = userLocation || focusedLocation;
    if (location) {
      return {
        lat: location.latitude,
        lng: location.longitude,
      };
    }
    return {
      lat: 35.1156,
      lng: 129.0403,
    };
  };

  const [center, setCenter] = useState(getInitialCenter());

  // userLocation이 변경되면 center 업데이트
  useEffect(() => {
    if (userLocation) {
      setCenter({
        lat: userLocation.latitude,
        lng: userLocation.longitude,
      });
    }
  }, [userLocation]);

  // focusedLocation이 변경되면 지도 이동
  useEffect(() => {
    if (focusedLocation && mapRef.current) {
      // 좌표가 유효한 숫자인지 확인
      const lat = Number(focusedLocation.latitude);
      const lng = Number(focusedLocation.longitude);

      if (!isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng)) {
        // 리스트가 하단을 가리므로, 마커를 상단에 배치하기 위해
        // 지도 중심을 아래로 이동 (마커가 상단에 보이도록)
        const latitudeOffset = -0.004;
        const newCenter = {
          lat: lat + latitudeOffset,
          lng: lng,
        };
        mapRef.current.panTo(newCenter);
        mapRef.current.setZoom(16);
      } else {
        console.error("Invalid coordinates:", focusedLocation);
      }
    }
  }, [focusedLocation]);

  // 언어가 변경될 때마다 지도를 다시 로드
  useEffect(() => {
    setMapKey((prev) => prev + 1);
  }, [selectedLanguage.code]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    language: "en", // 영어로 고정 (Google Maps는 동적 언어 변경 미지원)
  });

  if (loadError) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <p style={styles.errorText}>지도를 불러오는 중 오류가 발생했습니다.</p>
          <p style={styles.errorSubText}>Google Maps API 키를 확인해주세요.</p>
        </View>
      </View>
    );
  }

  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <p style={styles.loadingText}>지도 로딩 중... ({selectedLanguage.nativeName})</p>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container} key={selectedLanguage.code}>
      <style>
        {`
          .market-label {
            background: white !important;
            padding: 4px 8px !important;
            border-radius: 8px !important;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3) !important;
            border: 2px solid #333 !important;
            font-family: 'Arial', sans-serif !important;
            white-space: nowrap !important;
          }
        `}
      </style>
      <GoogleMap
        key={mapKey}
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        onLoad={(map) => {
          mapRef.current = map;
        }}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          disableDefaultUI: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        }}
      >
        {markets
          .filter((market) => {
            const lat = Number(market.latitude);
            const lng = Number(market.longitude);
            return !isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng);
          })
          .map((market) => {
            const isSelected = selectedMarketId === market.id;
            return (
              <Marker
                key={`market-${market.id}`}
                position={{ lat: Number(market.latitude), lng: Number(market.longitude) }}
                title={market.name}
                onClick={() => onMarkerPress?.(market)}
                label={{
                  text: market.name,
                  color: "#000000",
                  fontSize: "12px",
                  fontWeight: "bold",
                  className: "market-label",
                }}
                icon={{
                  url: isSelected
                    ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                    : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  scaledSize: isSelected ? new google.maps.Size(56, 56) : new google.maps.Size(40, 40),
                  labelOrigin: new google.maps.Point(20, -10),
                }}
                zIndex={isSelected ? 1000 : 1}
              />
            );
          })}

        {shops
          .filter((shop) => {
            const lat = Number(shop.latitude);
            const lng = Number(shop.longitude);
            return !isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng);
          })
          .map((shop) => (
            <Marker
              key={`shop-${shop.id}`}
              position={{ lat: Number(shop.latitude), lng: Number(shop.longitude) }}
              title={shop.name}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue.png",
              }}
            />
          ))}

        {/* 사용자 위치 마커 */}
        {userLocation && (
          <Marker
            position={{ lat: userLocation.latitude, lng: userLocation.longitude }}
            title="My Location"
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 3,
            }}
            zIndex={999}
          />
        )}
      </GoogleMap>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#dc2626",
    marginBottom: 8,
  },
  errorSubText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
  },
});
