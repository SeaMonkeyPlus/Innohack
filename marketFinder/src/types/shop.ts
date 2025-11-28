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
