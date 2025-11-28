import { Shop } from './shop';

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
  shops: Shop[];
}
