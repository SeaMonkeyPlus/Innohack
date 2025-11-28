import { Shop } from '@/src/types/shop';
import React from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ShopListProps {
  shops: Shop[];
  marketName: string;
  onBack: () => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onShopPress?: (shop: Shop) => void;
}

export function ShopList({
  shops,
  marketName,
  onBack,
  isMinimized,
  onToggleMinimize,
  onShopPress,
}: ShopListProps) {
  const renderShopCard = ({ item }: { item: Shop }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => onShopPress?.(item)}
      >
        <View style={styles.cardContent}>
          {item.images && item.images.length > 0 ? (
            <Image source={{ uri: item.images[0] }} style={styles.cardImage} resizeMode="cover" />
          ) : (
            <View style={styles.cardImagePlaceholder}>
              <Text style={styles.placeholderText}>🏪</Text>
            </View>
          )}

          <View style={styles.cardInfo}>
            <Text style={styles.shopName} numberOfLines={1}>
              {item.name}
            </Text>

            <View style={styles.infoRow}>
              {item.category && (
                <Text style={styles.category}>{item.category}</Text>
              )}
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>⭐ {item.rating.toFixed(1)}</Text>
              </View>
            </View>

            {item.address && (
              <Text style={styles.address} numberOfLines={1}>
                📍 {item.address}
              </Text>
            )}

            {item.description && (
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
            )}

            {item.openingHours && (
              <Text style={styles.hours}>
                🕐 {item.openingHours}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, isMinimized && styles.containerMinimized]}>
      <TouchableOpacity style={styles.header} onPress={onToggleMinimize} activeOpacity={0.8}>
        <View style={styles.dragHandle} />
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{marketName}</Text>
            <Text style={styles.headerCount}>{shops.length}개 가게</Text>
          </View>
        </View>
        <Text style={styles.toggleIcon}>{isMinimized ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {!isMinimized && (
        <FlatList
          data={shops}
          renderItem={renderShopCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  containerMinimized: {
    height: 80,
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    marginBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  backButton: {
    marginRight: 12,
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
  },
  headerTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  headerCount: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  toggleIcon: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
  },
  cardImage: {
    width: 120,
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  cardImagePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
  },
  cardInfo: {
    flex: 1,
    padding: 12,
  },
  shopName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  category: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 13,
    color: '#FFA500',
    fontWeight: '600',
  },
  address: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#888',
    lineHeight: 16,
    marginBottom: 4,
  },
  hours: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '500',
  },
});
