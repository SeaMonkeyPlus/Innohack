export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  phone: string;
  address?: string;
  description?: string;
  images: string[];
  menuItems: MenuItem[];
  rating?: number;
  category?: string;
}
