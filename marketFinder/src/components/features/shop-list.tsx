import { fetchProductsByStoreId, Product } from "@/src/services/market-api";
import { Shop } from "@/src/types/shop";
import { useTranslation } from "@hooks/use-translation";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Linking,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLanguage } from "../../contexts/language-context";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const MIN_HEIGHT = SCREEN_HEIGHT * 0.1; // 10%
const MAX_HEIGHT = SCREEN_HEIGHT * 0.85; // 85%

interface ShopListProps {
  shops: Shop[];
  marketName: string;
  onBack: () => void;
  onShopPress?: (shop: Shop) => void;
  searchKeyword?: string | null;
  sharedHeight: number | null;
  onHeightChange: (height: number) => void;
}

export function ShopList({
  shops,
  marketName,
  onBack,
  onShopPress,
  searchKeyword,
  sharedHeight,
  onHeightChange,
}: ShopListProps) {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();
  const [expandedShopId, setExpandedShopId] = useState<string | null>(null);
  const [products, setProducts] = useState<Record<string, Product[]>>({});
  const [loadingProducts, setLoadingProducts] = useState<Record<string, boolean>>({});
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

  const handleShopPress = async (shop: Shop) => {
    // Toggle expand/collapse
    if (expandedShopId === shop.id) {
      setExpandedShopId(null);
    } else {
      setExpandedShopId(shop.id);
      onShopPress?.(shop);

      // 상품 정보가 없으면 API에서 가져오기
      if (!products[shop.id]) {
        setLoadingProducts((prev) => ({ ...prev, [shop.id]: true }));
        try {
          const productData = await fetchProductsByStoreId(shop.id, selectedLanguage.code);
          setProducts((prev) => ({ ...prev, [shop.id]: productData }));
        } catch (error) {
          console.error("Failed to load products:", error);
          setProducts((prev) => ({ ...prev, [shop.id]: [] }));
        } finally {
          setLoadingProducts((prev) => ({ ...prev, [shop.id]: false }));
        }
      }
    }
  };

  const handlePhonePress = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const renderShopCard = ({ item }: { item: Shop }) => {
    const isExpanded = expandedShopId === item.id;
    return (
      <TouchableOpacity
        style={[styles.card, isExpanded && styles.cardExpanded]}
        activeOpacity={0.9}
        onPress={() => handleShopPress(item)}
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
              {item.category && <Text style={styles.category}>{item.category}</Text>}
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

            {!isExpanded && item.openingHours && <Text style={styles.hours}>🕐 {item.openingHours}</Text>}
          </View>
        </View>

        {/* Expanded Detail Section */}
        {isExpanded && (
          <View style={styles.detailSection}>
            <View style={styles.divider} />

            {/* Additional Images */}
            {item.images && item.images.length > 1 && (
              <View style={styles.imageGallery}>
                {item.images.slice(1).map((imageUri, index) => (
                  <Image key={index} source={{ uri: imageUri }} style={styles.galleryImage} resizeMode="cover" />
                ))}
              </View>
            )}

            {/* Full Description */}
            {item.description && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>📋 {t.shop.description}</Text>
                <Text style={styles.detailText}>{item.description}</Text>
              </View>
            )}

            {/* Full Address */}
            {item.address && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>📍 {t.shop.address}</Text>
                <Text style={styles.detailText}>{item.address}</Text>
              </View>
            )}

            {/* Opening Hours */}
            {item.openingHours && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>🕐 {t.shop.openingHours}</Text>
                <Text style={styles.detailText}>{item.openingHours}</Text>
              </View>
            )}

            {/* Phone */}
            {item.phone && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>📞 {t.shop.phone}</Text>
                <TouchableOpacity onPress={() => handlePhonePress(item.phone!)}>
                  <Text style={[styles.detailText, styles.phoneLink]}>{item.phone}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Rating Detail */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>⭐ {t.shop.rating}</Text>
              <View style={styles.ratingDetail}>
                <Text style={styles.ratingDetailText}>{item.rating.toFixed(1)} / 5.0</Text>
                <View style={styles.starContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Text key={star} style={styles.star}>
                      {star <= Math.round(item.rating) ? "⭐" : "☆"}
                    </Text>
                  ))}
                </View>
              </View>
            </View>

            {/* Category */}
            {item.category && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>🏷️ {t.shop.category}</Text>
                <Text style={styles.detailText}>{item.category}</Text>
              </View>
            )}

            {/* Products/Menu */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>🍽️ {t.shop.products}</Text>
              {loadingProducts[item.id] ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#4CAF50" />
                  <Text style={styles.loadingText}>{t.shop.loading}</Text>
                </View>
              ) : products[item.id] && products[item.id].length > 0 ? (
                <View style={styles.menuContainer}>
                  {products[item.id].map((product) => (
                    <View key={product.id} style={styles.menuItem}>
                      <View style={styles.productContent}>
                        {product.images && product.images.length > 0 && (
                          <Image source={{ uri: product.images[0] }} style={styles.productImage} resizeMode="cover" />
                        )}
                        <View style={styles.productInfo}>
                          <View style={styles.menuItemHeader}>
                            <Text style={styles.menuItemName}>{product.name}</Text>
                            <Text style={styles.menuItemPrice}>
                              {product.price.toLocaleString()}
                              {t.common.won}
                            </Text>
                          </View>
                          {product.description && <Text style={styles.menuItemDescription}>{product.description}</Text>}
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noProductsText}>{t.shop.noProducts}</Text>
              )}
            </View>

            <TouchableOpacity style={styles.collapseButton} onPress={() => setExpandedShopId(null)}>
              <Text style={styles.collapseButtonText}>{t.shop.collapse} ▲</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View style={[styles.container, { height: panelHeight }]}>
      <View style={styles.headerWrapper}>
        <View style={styles.header} {...panResponder.panHandlers}>
          <View style={styles.dragHandle} />
        </View>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{marketName}</Text>
            <Text style={styles.headerCount}>
              {shops.length}
              {t.shop.count}
              {searchKeyword ? ` (${searchKeyword})` : ""}
            </Text>
          </View>
        </View>
      </View>
      {searchKeyword && shops.length === 0 && (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>
            "{searchKeyword}" {t.market.noResults}
          </Text>
          <Text style={styles.noResultsSubtext}>{t.market.tryAgain}</Text>
        </View>
      )}
      <FlatList
        data={shops}
        renderItem={renderShopCard}
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
  headerWrapper: {
    flexDirection: "column",
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#ddd",
    borderRadius: 3,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backButton: {
    marginRight: 12,
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: "#333",
  },
  headerTextContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  headerCount: {
    fontSize: 14,
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
  cardExpanded: {
    borderColor: "#4CAF50",
    borderWidth: 2,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
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
  shopName: {
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
    fontSize: 12,
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
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: "#888",
    lineHeight: 16,
    marginBottom: 4,
  },
  hours: {
    fontSize: 11,
    color: "#4CAF50",
    fontWeight: "500",
  },
  detailSection: {
    padding: 16,
    backgroundColor: "#fafafa",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginBottom: 16,
  },
  imageGallery: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  galleryImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  detailRow: {
    marginBottom: 14,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  phoneLink: {
    color: "#2196F3",
    textDecorationLine: "underline",
  },
  ratingDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ratingDetailText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFA500",
  },
  starContainer: {
    flexDirection: "row",
    gap: 2,
  },
  star: {
    fontSize: 16,
  },
  collapseButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    alignItems: "center",
  },
  collapseButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  noResultsContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  noResultsSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  menuContainer: {
    marginTop: 8,
  },
  menuItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  menuItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  menuItemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  menuItemPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  menuItemDescription: {
    fontSize: 12,
    color: "#888",
    lineHeight: 16,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
  },
  noProductsText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    paddingVertical: 8,
  },
  productContent: {
    flexDirection: "row",
    gap: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  productInfo: {
    flex: 1,
  },
});
