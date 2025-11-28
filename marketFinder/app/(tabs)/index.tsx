import { StyleSheet, View } from 'react-native';

import { LanguageSelector } from '@components/features/language-selector';
import { MapViewComponent } from '@components/features/map-view';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Language Selector - Fixed at top left */}
      <View style={styles.languageSelectorContainer}>
        <LanguageSelector />
      </View>

      {/* Google Map */}
      <MapViewComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  languageSelectorContainer: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 1000,
  },
});
