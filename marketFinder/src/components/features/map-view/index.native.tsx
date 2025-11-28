import { Market } from '@/src/types/market';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

interface MapViewComponentProps {
  markets: Market[];
  onMarkerPress?: (market: Market) => void;
  selectedMarketId?: string;
}

export function MapViewComponent({ markets, onMarkerPress, selectedMarketId }: MapViewComponentProps) {
  // 기본 위치: 부산역
  const defaultRegion = {
    latitude: 35.1156,
    longitude: 129.0403,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <MapView
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
