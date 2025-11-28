import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useLanguage } from '../../contexts/language-context';

interface MapViewComponentProps {
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

export function MapViewComponent({ initialRegion }: MapViewComponentProps) {
  const { selectedLanguage } = useLanguage();
  const mapRef = useRef<MapView>(null);

  // 기본 위치: 서울
  const defaultRegion = {
    latitude: 37.5665,
    longitude: 126.9780,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const region = initialRegion || defaultRegion;

  // 언어가 변경되면 지도를 새로고침
  useEffect(() => {
    if (mapRef.current) {
      // 지도 언어 변경을 위해 region을 약간 변경했다가 다시 원래대로
      mapRef.current.animateToRegion(
        {
          ...region,
          latitudeDelta: region.latitudeDelta * 1.0001,
        },
        100
      );
      setTimeout(() => {
        mapRef.current?.animateToRegion(region, 100);
      }, 150);
    }
  }, [selectedLanguage.code]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton
        showsCompass
        showsScale
        // 구글맵 언어 설정
        mapType="standard"
        // 언어 설정은 Google Maps API 키 설정에서 처리됩니다
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
  map: {
    width: '100%',
    height: '100%',
  },
});
