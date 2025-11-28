// 백엔드 API 기본 URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// 백엔드 API 응답 타입
export interface MarketApiResponse {
  id: number;
  created_at: string;
  name: string;
  lat: number;
  lon: number;
}

// 프론트엔드 Market 타입
export interface Market {
  id: string;
  name: string;
  address: string;
  description?: string;
  latitude: number;
  longitude: number;
  category: string;
  rating?: number;
  images?: string[];
  phone?: string;
  openingHours?: string;
  shops: any[]; // Shop 타입 참조
}

/**
 * API 응답을 프론트엔드 Market 타입으로 변환
 */
const convertApiResponseToMarket = (apiMarket: MarketApiResponse): Market => {
  return {
    id: apiMarket.id.toString(),
    name: apiMarket.name,
    address: "부산광역시", // API에서 주소 정보가 없으므로 기본값 설정
    description: `${apiMarket.name}에 오신 것을 환영합니다.`,
    latitude: Number(apiMarket.lat),
    longitude: Number(apiMarket.lon),
    category: "전통시장",
    rating: undefined,
    images: [],
    phone: undefined,
    openingHours: undefined,
    shops: [],
  };
};

/**
 * 시장 목록을 가져오는 API 함수
 * @param langCode - 언어 코드 (예: 'ko', 'en', 'ja', 'zh')
 * @returns Market 배열
 */
export const fetchMarkets = async (langCode: string = "en"): Promise<Market[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/markets?lang_code=${langCode}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: MarketApiResponse[] = await response.json();

    // API 응답 데이터를 Market 배열로 변환
    const markets: Market[] = data.map(convertApiResponseToMarket);

    return markets;
  } catch (error) {
    console.error("Error fetching markets:", error);
    throw error;
  }
};

/**
 * 특정 시장 정보를 가져오는 API 함수
 * @param marketId - 시장 ID
 * @returns Market 데이터
 */
export const fetchMarketById = async (marketId: string): Promise<Market | null> => {
  try {
    const markets = await fetchMarkets();
    const market = markets.find((m) => m.id === marketId);
    return market || null;
  } catch (error) {
    console.error("Error fetching market by id:", error);
    throw error;
  }
};

// 백엔드 Store API 응답 타입
export interface StoreApiResponse {
  id: number;
  name: string;
  lat: number;
  lon: number;
  address: string;
  created_at: string;
  image_url: string | null;
  summary: string | null;
  rating: number | null;
  market_id: number;
}

// Shop 타입 (프론트엔드에서 사용)
export interface Shop {
  id: string;
  name: string;
  address?: string;
  rating: number;
  description?: string;
  images?: string[];
  category?: string;
  latitude: number;
  longitude: number;
  phone?: string;
  openingHours?: string;
}

/**
 * API 응답을 프론트엔드 Shop 타입으로 변환
 */
const convertApiResponseToShop = (apiStore: StoreApiResponse): Shop => {
  return {
    id: apiStore.id.toString(),
    name: apiStore.name,
    address: apiStore.address,
    rating: apiStore.rating || 0,
    description: apiStore.summary || undefined,
    images: apiStore.image_url ? [apiStore.image_url] : [],
    latitude: Number(apiStore.lat),
    longitude: Number(apiStore.lon),
    phone: undefined,
    openingHours: undefined,
  };
};

/**
 * 특정 시장의 가게 목록을 가져오는 API 함수
 * @param marketId - 시장 ID
 * @param langCode - 언어 코드 (예: 'ko', 'en', 'ja', 'zh')
 * @returns Shop 배열
 */
export const fetchStoresByMarketId = async (marketId: string, langCode: string = "en"): Promise<Shop[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/markets/${marketId}/stores?lang_code=${langCode}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: StoreApiResponse[] = await response.json();

    // API 응답 데이터를 Shop 배열로 변환
    const shops: Shop[] = data.map(convertApiResponseToShop);

    return shops;
  } catch (error) {
    console.error("Error fetching stores:", error);
    throw error;
  }
};

// 백엔드 Product API 응답 타입
export interface ProductApiResponse {
  id: number;
  created_at: string;
  store_id: number;
  name: string;
  price: number;
  image_url: string | null;
  summary: string | null;
}

// Product 타입 (프론트엔드에서 사용)
export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  description?: string;
  images?: string[];
  category?: string;
}

/**
 * API 응답을 프론트엔드 Product 타입으로 변환
 */
const convertApiResponseToProduct = (apiProduct: ProductApiResponse): Product => {
  return {
    id: apiProduct.id.toString(),
    name: apiProduct.name,
    price: apiProduct.price,
    rating: 0, // API에서 rating 정보가 없으므로 기본값
    description: apiProduct.summary || undefined,
    images: apiProduct.image_url ? [apiProduct.image_url] : [],
    category: undefined,
  };
};

/**
 * 특정 가게의 상품 목록을 가져오는 API 함수
 * @param storeId - 가게 ID
 * @param langCode - 언어 코드 (예: 'ko', 'en', 'ja', 'zh')
 * @returns Product 배열
 */
export const fetchProductsByStoreId = async (storeId: string, langCode: string = "en"): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stores/${storeId}/products?lang_code=${langCode}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ProductApiResponse[] = await response.json();

    // API 응답 데이터를 Product 배열로 변환
    const products: Product[] = data.map(convertApiResponseToProduct);

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// 이미지 예측 API URL
const PREDICT_API_URL = process.env.EXPO_PUBLIC_PREDICT_API_URL || "http://localhost:8000/";

// 이미지 예측 API 응답 타입
export interface PredictApiResponse {
  label: string;
  confidence: number;
  chosen_label: string;
  shops: PredictShop[];
  explanation: {
    title: string;
    summary: string;
  };
}

export interface PredictShop {
  store_id: number;
  store_name: string;
  lat: number;
  lon: number;
  address: string;
  menu_id: number;
  menu_name: string;
  menu_price: number;
  similarity: number;
  menus: PredictMenu[];
}

export interface PredictMenu {
  menu_id: number;
  menu_name: string;
  menu_price: number;
}

/**
 * 이미지를 분석하여 음식을 인식하고 관련 가게 목록을 가져오는 API 함수
 * @param imageUri - 이미지 URI
 * @param langCode - 언어 코드 (예: 'ko', 'en', 'ja')
 * @param marketId - 시장 ID
 * @returns 예측 결과 및 가게 목록
 */
export const predictFoodImage = async (
  imageUri: string,
  langCode: string,
  marketId: string
): Promise<PredictApiResponse> => {
  try {
    const formData = new FormData();

    // 웹 환경인 경우 Blob으로 변환
    if (imageUri.startsWith("data:") || imageUri.startsWith("blob:")) {
      // Data URL을 Blob으로 변환
      const response = await fetch(imageUri);
      const blob = await response.blob();
      formData.append("file", blob, "food_photo.jpg");
    } else {
      // React Native 환경
      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "food_photo.jpg",
      } as any);
    }

    // 언어 코드 추가
    formData.append("lang_code", langCode);

    // 시장 ID 추가
    formData.append("market_no", marketId);

    const response = await fetch(PREDICT_API_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PredictApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error predicting food image:", error);
    throw error;
  }
};
