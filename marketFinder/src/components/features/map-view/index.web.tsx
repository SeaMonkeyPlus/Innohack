import { Market } from '@/src/types/market';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLanguage } from '../../../contexts/language-context';

interface MapViewComponentProps {
  markets: Market[];
  onMarkerPress?: (market: Market) => void;
  selectedMarketId?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

export function MapViewComponent({ markets, onMarkerPress, selectedMarketId }: MapViewComponentProps) {
  const { selectedLanguage } = useLanguage();
  const [mapKey, setMapKey] = useState(0);

  // 기본 위치: 부산역
  const center = {
    lat: 35.1156,
    lng: 129.0403,
  };

  // 언어가 변경될 때마다 지도를 다시 로드
  useEffect(() => {
    setMapKey(prev => prev + 1);
  }, [selectedLanguage.code]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    language: 'en', // 영어로 고정 (Google Maps는 동적 언어 변경 미지원)
  });

  if (loadError) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <p style={styles.errorText}>지도를 불러오는 중 오류가 발생했습니다.</p>
          <p style={styles.errorSubText}>
            Google Maps API 키를 확인해주세요.
          </p>
        </View>
      </View>
    );
  }

  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <p style={styles.loadingText}>
            지도 로딩 중... ({selectedLanguage.nativeName})
          </p>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container} key={selectedLanguage.code}>
      <GoogleMap
        key={mapKey}
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          disableDefaultUI: false,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
        }}
      >
        {markets.map((market) => (
          <Marker
            key={market.id}
            position={{ lat: market.latitude, lng: market.longitude }}
            title={market.name}
            onClick={() => onMarkerPress?.(market)}
            icon={{
              url: selectedMarketId === market.id
                ? 'http://maps.google.com/mapfiles/ms/icons/brown.png'
                : 'http://maps.google.com/mapfiles/ms/icons/red.png',
            }}
          />
        ))}
      </GoogleMap>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 8,
  },
  errorSubText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
});
