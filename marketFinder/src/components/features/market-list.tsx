import { Market } from "@/src/types/market";
import { useTranslation } from "@hooks/use-translation";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const MIN_HEIGHT = SCREEN_HEIGHT * 0.1; // 10%
const MAX_HEIGHT = SCREEN_HEIGHT * 0.85; // 85%

interface MarketListProps {
  markets: Market[];
  selectedMarketId?: string;
  onMarketPress: (market: Market) => void;
  onSelectMarket: (market: Market) => void;
  sharedHeight: number | null;
  onHeightChange: (height: number) => void;
}

export function MarketList({
  markets,
  selectedMarketId,
  onMarketPress,
  onSelectMarket,
  sharedHeight,
  onHeightChange,
}: MarketListProps) {
  const { t } = useTranslation();
  const [expandedMarketId, setExpandedMarketId] = useState<string | null>(null);
  const initialHeight = sharedHeight || MIN_HEIGHT;
  const [currentHeight, setCurrentHeight] = useState(initialHeight);
  const panelHeight = useRef(new Animated.Value(initialHeight)).current;
  const dragStartHeight = useRef(initialHeight);
  const lastHeight = useRef(initialHeight);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // 드래그 시작 시 현재 높이 저장 (lastHeight를 사용하여 즉시 반영)
        dragStartHeight.current = lastHeight.current;
      },
      onPanResponderMove: (_, gesture) => {
        // 위로 드래그하면 gesture.dy가 음수 (높이 증가)
        // 아래로 드래그하면 gesture.dy가 양수 (높이 감소)
        const newHeight = dragStartHeight.current - gesture.dy;

        // 최소/최대 높이 제한을 적용하여 실시간 업데이트
        if (newHeight >= MIN_HEIGHT && newHeight <= MAX_HEIGHT) {
          panelHeight.setValue(newHeight);
        } else if (newHeight < MIN_HEIGHT) {
          panelHeight.setValue(MIN_HEIGHT);
        } else if (newHeight > MAX_HEIGHT) {
          panelHeight.setValue(MAX_HEIGHT);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        // 최종 높이 계산
        let finalHeight = dragStartHeight.current - gesture.dy;

        // 최소/최대 높이 제한
        if (finalHeight < MIN_HEIGHT) {
          finalHeight = MIN_HEIGHT;
        } else if (finalHeight > MAX_HEIGHT) {
          finalHeight = MAX_HEIGHT;
        }

        // 현재 높이 상태 업데이트
        setCurrentHeight(finalHeight);
        lastHeight.current = finalHeight;
        onHeightChange(finalHeight); // 부모 컴포넌트에 높이 전달

        // 부드러운 애니메이션으로 최종 위치에 고정
        Animated.spring(panelHeight, {
          toValue: finalHeight,
          useNativeDriver: false,
          friction: 8,
          tension: 40,
        }).start(() => {
          // 애니메이션 완료 후 값 명시적으로 설정
          panelHeight.setValue(finalHeight);
        });
      },
    })
  ).current;

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
            <Text style={[styles.selectButtonText, isSelected && styles.selectButtonTextSelected]}>
              {t.market.selectMarket}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, { height: panelHeight }]}>
      <View style={styles.header} {...panResponder.panHandlers}>
        <View style={styles.dragHandle} />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t.market.title}</Text>
          <Text style={styles.headerCount}>
            {markets.length}
            {t.common.count}
          </Text>
        </View>
      </View>
      <FlatList
        data={markets}
        renderItem={renderMarketCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </Animated.View>
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
  header: {
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#ddd",
    borderRadius: 3,
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
