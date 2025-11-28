import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

interface MapViewComponentProps {
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

export function MapViewComponent({ initialRegion }: MapViewComponentProps) {
  // 기본 위치: 부산역
  const defaultRegion = {
    latitude: 35.1156,
    longitude: 129.0403,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const region = initialRegion || defaultRegion;

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton
        showsCompass
        showsScale
        mapType="standard"
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
