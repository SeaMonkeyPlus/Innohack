import { Restaurant } from "../types/restaurant";

// 백엔드 API 기본 URL
const API_BASE_URL = "https://api.example.com";

/**
 * 음식점 상세 정보를 가져오는 API 함수
 * @param restaurantId - 음식점 ID
 * @returns Restaurant 데이터
 */
export const fetchRestaurantById = async (restaurantId: string): Promise<Restaurant> => {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // 필요한 경우 인증 토큰 추가
        // 'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // API 응답 데이터를 Restaurant 타입으로 변환
    const restaurant: Restaurant = {
      id: data.id,
      name: data.name,
      phone: data.phone,
      address: data.address,
      description: data.description,
      category: data.category,
      rating: data.rating,
      images: data.images || [],
      menuItems:
        data.menu_items?.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
        })) || [],
    };

    return restaurant;
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    throw error;
  }
};

/**
 * 여러 음식점 목록을 가져오는 API 함수
 * @param params - 검색 파라미터 (카테고리, 위치 등)
 * @returns Restaurant 배열
 */
export const fetchRestaurants = async (params?: {
  category?: string;
  location?: string;
  page?: number;
  limit?: number;
}): Promise<Restaurant[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append("category", params.category);
    if (params?.location) queryParams.append("location", params.location);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const url = `${API_BASE_URL}/restaurants${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // API 응답 데이터를 Restaurant 배열로 변환
    const restaurants: Restaurant[] =
      data.results?.map((item: any) => ({
        id: item.id,
        name: item.name,
        phone: item.phone,
        address: item.address,
        description: item.description,
        category: item.category,
        rating: item.rating,
        images: item.images || [],
        menuItems:
          item.menu_items?.map((menuItem: any) => ({
            id: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            description: menuItem.description,
          })) || [],
      })) || [];

    return restaurants;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }
};

/**
 * 음식점 검색 API 함수
 * @param keyword - 검색 키워드
 * @returns Restaurant 배열
 */
export const searchRestaurants = async (keyword: string): Promise<Restaurant[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurants/search?q=${encodeURIComponent(keyword)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const restaurants: Restaurant[] =
      data.results?.map((item: any) => ({
        id: item.id,
        name: item.name,
        phone: item.phone,
        address: item.address,
        description: item.description,
        category: item.category,
        rating: item.rating,
        images: item.images || [],
        menuItems:
          item.menu_items?.map((menuItem: any) => ({
            id: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            description: menuItem.description,
          })) || [],
      })) || [];

    return restaurants;
  } catch (error) {
    console.error("Error searching restaurants:", error);
    throw error;
  }
};

/**
 * 새 음식점을 등록하는 API 함수
 * @param restaurantData - 등록할 음식점 데이터
 * @returns 생성된 Restaurant 데이터
 */
export const createRestaurant = async (restaurantData: {
  name: string;
  phone: string;
  address: string;
  description?: string;
  category: string;
  images: string[];
  menuItems: Array<{
    name: string;
    price: number;
    description?: string;
  }>;
}): Promise<Restaurant> => {
  try {
    // 이미지 업로드가 필요한 경우, 먼저 이미지를 업로드하고 URL을 받아옴
    // const uploadedImageUrls = await uploadImages(restaurantData.images);

    const response = await fetch(`${API_BASE_URL}/restaurants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 필요한 경우 인증 토큰 추가
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: restaurantData.name,
        phone: restaurantData.phone,
        address: restaurantData.address,
        description: restaurantData.description,
        category: restaurantData.category,
        images: restaurantData.images, // 실제로는 uploadedImageUrls를 사용
        menu_items: restaurantData.menuItems.map((item) => ({
          name: item.name,
          price: item.price,
          description: item.description,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // API 응답을 Restaurant 타입으로 변환
    const restaurant: Restaurant = {
      id: data.id,
      name: data.name,
      phone: data.phone,
      address: data.address,
      description: data.description,
      category: data.category,
      rating: data.rating,
      images: data.images || [],
      menuItems:
        data.menu_items?.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
        })) || [],
    };

    return restaurant;
  } catch (error) {
    console.error("Error creating restaurant:", error);
    throw error;
  }
};

/**
 * 이미지 파일들을 업로드하는 함수
 * @param imageUris - 업로드할 이미지 URI 배열
 * @returns 업로드된 이미지 URL 배열
 */
export const uploadImages = async (imageUris: string[]): Promise<string[]> => {
  try {
    const uploadPromises = imageUris.map(async (uri) => {
      const formData = new FormData();

      // URI에서 파일 이름 추출
      const filename = uri.split("/").pop() || "image.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("image", {
        uri,
        name: filename,
        type,
      } as any);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        headers: {
          // 'Content-Type': 'multipart/form-data', // fetch가 자동으로 설정
          // 필요한 경우 인증 토큰 추가
          // 'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed! status: ${response.status}`);
      }

      const data = await response.json();
      return data.url; // 서버에서 반환하는 이미지 URL
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};

/**
 * 촬영한 이미지와 크롭 영역을 분석하는 API 함수
 * @param imageUri - 촬영한 이미지 URI
 * @param cropArea - 선택한 영역 정보
 * @returns 분석 결과 (관련 음식점 정보 등)
 */
export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AnalysisResult {
  success: boolean;
  message: string;
  restaurants?: Restaurant[];
  detectedItems?: Array<{
    name: string;
    confidence: number;
  }>;
}

export const analyzeImage = async (imageUri: string, cropArea: CropArea): Promise<AnalysisResult> => {
  try {
    const formData = new FormData();

    // 이미지 파일 추가
    const filename = imageUri.split("/").pop() || "photo.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("image", {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    // 크롭 영역 정보 추가
    formData.append("cropArea", JSON.stringify(cropArea));

    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      headers: {
        // 필요한 경우 인증 토큰 추가
        // 'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Analysis failed! status: ${response.status}`);
    }

    const data = await response.json();

    // API 응답을 AnalysisResult 타입으로 변환
    const result: AnalysisResult = {
      success: data.success,
      message: data.message,
      restaurants: data.restaurants?.map((item: any) => ({
        id: item.id,
        name: item.name,
        phone: item.phone,
        address: item.address,
        description: item.description,
        category: item.category,
        rating: item.rating,
        images: item.images || [],
        menuItems:
          item.menu_items?.map((menuItem: any) => ({
            id: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            description: menuItem.description,
          })) || [],
      })),
      detectedItems: data.detected_items,
    };

    return result;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};
