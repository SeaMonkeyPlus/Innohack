/**
 * 기본 이미지 상수
 * 이미지가 없을 때 사용할 placeholder 이미지
 */

// 온라인 placeholder 이미지 사용 (https://placehold.co)
export const DEFAULT_IMAGES = {
  // 시장 기본 이미지 (빨간색 배경, 흰색 텍스트)
  market: "https://placehold.co/400x300/FF6B6B/FFFFFF/png?text=Market",

  // 가게 기본 이미지 (파란색 배경, 흰색 텍스트)
  shop: "https://placehold.co/400x300/2196F3/FFFFFF/png?text=Shop",

  // 메뉴/상품 기본 이미지 (초록색 배경, 흰색 텍스트)
  product: "https://placehold.co/400x300/4CAF50/FFFFFF/png?text=Product",

  // 레스토랑 기본 이미지 (주황색 배경, 흰색 텍스트)
  restaurant: "https://placehold.co/400x300/FF9800/FFFFFF/png?text=Restaurant",
} as const;

/**
 * 이미지 URL 또는 배열을 받아서 유효한 이미지를 반환
 * 이미지가 없거나 유효하지 않으면 기본 이미지 반환
 */
export function getImageUrl(
  images: string | string[] | undefined,
  defaultType: keyof typeof DEFAULT_IMAGES = "shop"
): string {
  if (!images) {
    return DEFAULT_IMAGES[defaultType];
  }

  if (Array.isArray(images)) {
    return images.length > 0 && images[0] ? images[0] : DEFAULT_IMAGES[defaultType];
  }

  return images || DEFAULT_IMAGES[defaultType];
}
