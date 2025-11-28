import { Market } from '@/src/types/market';
import React from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface MarketVerticalListProps {
  markets: Market[];
  selectedMarketId?: string;
  onMarketPress: (market: Market) => void;
  onMarketDetailPress?: (market: Market) => void;
}

export function MarketVerticalList({
  markets,
  selectedMarketId,
  onMarketPress,
  onMarketDetailPress,
}: MarketVerticalListProps) {
  const renderMarketCard = ({ item }: { item: Market }) => {
    const isSelected = selectedMarketId === item.id;

    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => onMarketPress(item)}
        activeOpacity={0.9}
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
            <Text style={styles.marketName} numberOfLines={1}>
              {item.name}
            </Text>

            <View style={styles.infoRow}>
              <Text style={styles.category}>{item.category}</Text>
              {item.rating && (
                <View style={styles.ratingContainer}>
                  <Text style={styles.rating}>⭐ {item.rating.toFixed(1)}</Text>
                </View>
              )}
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
          </View>
        </View>

        {onMarketDetailPress && (
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => onMarketDetailPress(item)}
          >
            <Text style={styles.detailButtonText}>자세히 보기 →</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>주변 전통시장</Text>
        <Text style={styles.headerCount}>{markets.length}개</Text>
      </View>
      <FlatList
        data={markets}
        renderItem={renderMarketCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerCount: {
    fontSize: 16,
    color: '#666',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
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
  cardSelected: {
    borderColor: '#8B4513',
    borderWidth: 3,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
  marketName: {
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
    fontSize: 13,
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
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#888',
    lineHeight: 16,
  },
  detailButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
