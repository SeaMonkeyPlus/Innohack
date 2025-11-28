import { Market } from "@/src/types/market";
import { useTranslation } from "@hooks/use-translation";
import React from "react";
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MarketHorizontalListProps {
  markets: Market[];
  selectedMarketId?: string;
  onMarketPress: (market: Market) => void;
  onMarketDetailPress?: (market: Market) => void;
}

const CARD_WIDTH = Dimensions.get("window").width * 0.75;
const CARD_SPACING = 12;

export function MarketHorizontalList({
  markets,
  selectedMarketId,
  onMarketPress,
  onMarketDetailPress,
}: MarketHorizontalListProps) {
  const { t } = useTranslation();

  const renderMarketCard = ({ item }: { item: Market }) => {
    const isSelected = selectedMarketId === item.id;

    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => onMarketPress(item)}
        activeOpacity={0.9}
      >
        {item.images && item.images.length > 0 ? (
          <Image source={{ uri: item.images[0] }} style={styles.cardImage} resizeMode="cover" />
        ) : (
          <View style={styles.cardImagePlaceholder}>
            <Text style={styles.placeholderText}>🏪</Text>
          </View>
        )}

        <View style={styles.cardContent}>
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

          {onMarketDetailPress && (
            <TouchableOpacity style={styles.detailButton} onPress={() => onMarketDetailPress(item)}>
              <Text style={styles.detailButtonText}>{t.market.viewDetails}</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={markets}
        renderItem={renderMarketCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        snapToAlignment="center"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 220,
    backgroundColor: "transparent",
  },
  listContent: {
    paddingHorizontal: (Dimensions.get("window").width - CARD_WIDTH) / 2,
    paddingVertical: 12,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "white",
    borderRadius: 16,
    marginRight: CARD_SPACING,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  cardSelected: {
    borderWidth: 3,
    borderColor: "#8B4513",
  },
  cardImage: {
    width: "100%",
    height: 100,
    backgroundColor: "#f0f0f0",
  },
  cardImagePlaceholder: {
    width: "100%",
    height: 100,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 48,
  },
  cardContent: {
    padding: 12,
  },
  marketName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  category: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    color: "#FFA500",
    fontWeight: "600",
  },
  address: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: "#888",
    lineHeight: 18,
    marginBottom: 8,
  },
  detailButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  detailButtonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
});
