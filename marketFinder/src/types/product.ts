export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  description?: string;
  images?: string[];
  category?: string;
  latitude?: number;
  longitude?: number;
}
