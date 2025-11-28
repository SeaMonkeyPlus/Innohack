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
