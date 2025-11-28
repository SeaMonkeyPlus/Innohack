import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useLanguage } from '../../contexts/language-context';

interface MapViewComponentProps {
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

export function MapViewComponent({ initialRegion }: MapViewComponentProps) {
  const { selectedLanguage } = useLanguage();

  // 기본 위치: 서울
  const defaultRegion = {
    latitude: 37.5665,
    longitude: 126.9780,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const region = initialRegion || defaultRegion;

  const center = {
    lat: region.latitude,
    lng: region.longitude,
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    language: selectedLanguage.code,
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
          <p style={styles.loadingText}>지도 로딩 중...</p>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      />
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
