import { Market } from '@/src/types/market';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

interface MapViewComponentProps {
  markets: Market[];
  onMarkerPress?: (market: Market) => void;
  selectedMarketId?: string;
  focusedLocation?: { latitude: number; longitude: number } | null;
}

export function MapViewComponent({ markets, onMarkerPress, selectedMarketId, focusedLocation }: MapViewComponentProps) {
  const mapRef = useRef<MapView>(null);

  // 기본 위치: 부산역
  const defaultRegion: Region = {
    latitude: 35.1156,
    longitude: 129.0403,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
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
        initialRegion={defaultRegion}
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
        {markets.map((market) => (
          <Marker
            key={market.id}
            coordinate={{
              latitude: market.latitude,
              longitude: market.longitude,
            }}
            title={market.name}
            onPress={() => onMarkerPress?.(market)}
            pinColor={selectedMarketId === market.id ? '#8B4513' : '#FF6B6B'}
          />
        ))}
      </MapView>
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
