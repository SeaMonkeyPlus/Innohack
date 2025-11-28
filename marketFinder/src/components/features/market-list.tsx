import { Market } from "@/src/types/market";
import React, { useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MarketListProps {
  markets: Market[];
  selectedMarketId?: string;
  onMarketPress: (market: Market) => void;
  onSelectMarket: (market: Market) => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

export function MarketList({
  markets,
  selectedMarketId,
  onMarketPress,
  onSelectMarket,
  isMinimized,
  onToggleMinimize,
}: MarketListProps) {
  const [expandedMarketId, setExpandedMarketId] = useState<string | null>(null);

  const handleMarketCardPress = (market: Market) => {
    // Toggle expand/collapse
    if (expandedMarketId === market.id) {
      setExpandedMarketId(null);
    } else {
      setExpandedMarketId(market.id);
      onMarketPress(market);
    }
  };

  const renderMarketCard = ({ item }: { item: Market }) => {
    const isSelected = selectedMarketId === item.id;
    const isExpanded = expandedMarketId === item.id;

    return (
      <View style={[styles.card, isSelected && styles.cardSelected, isExpanded && styles.cardExpanded]}>
        <TouchableOpacity style={styles.cardContent} onPress={() => handleMarketCardPress(item)} activeOpacity={0.9}>
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
        </TouchableOpacity>

        {/* 선택하기 버튼 - 확장되었을 때만 표시 */}
        {isExpanded && (
          <TouchableOpacity
            style={[styles.selectButton, isSelected && styles.selectButtonSelected]}
            onPress={() => {
              onSelectMarket(item);
              setExpandedMarketId(null);
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.selectButtonText, isSelected && styles.selectButtonTextSelected]}>선택하기</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, isMinimized && styles.containerMinimized]}>
      <TouchableOpacity style={styles.header} onPress={onToggleMinimize} activeOpacity={0.8}>
        <View style={styles.dragHandle} />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>부산 전통시장</Text>
          <Text style={styles.headerCount}>{markets.length}개</Text>
        </View>
        <Text style={styles.toggleIcon}>{isMinimized ? "▲" : "▼"}</Text>
      </TouchableOpacity>
      {!isMinimized && (
        <FlatList
          data={markets}
          renderItem={renderMarketCard}
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  containerMinimized: {
    height: 80,
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
    marginBottom: 12,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  headerCount: {
    fontSize: 16,
    color: "#666",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  toggleIcon: {
    fontSize: 18,
    color: "#666",
    marginTop: 8,
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#f0f0f0",
    overflow: "hidden",
  },
  cardSelected: {
    borderColor: "#8B4513",
    borderWidth: 3,
    shadowColor: "#8B4513",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardExpanded: {
    borderColor: "#4CAF50",
    borderWidth: 2,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  cardContent: {
    flexDirection: "row",
  },
  cardImage: {
    width: 120,
    height: 120,
    backgroundColor: "#f0f0f0",
  },
  cardImagePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
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
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  category: {
    fontSize: 13,
    color: "#666",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 13,
    color: "#FFA500",
    fontWeight: "600",
  },
  address: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: "#888",
    lineHeight: 16,
  },
  selectButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    margin: 12,
    marginTop: 0,
    borderRadius: 8,
    alignItems: "center",
  },
  selectButtonSelected: {
    backgroundColor: "#8B4513",
  },
  selectButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  selectButtonTextSelected: {
    fontWeight: "bold",
  },
});
