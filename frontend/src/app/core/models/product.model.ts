export interface Product {
  id: number;
  name: string;
  category: string;

  price: number;
  originalPrice?: number;

  image: string;

  rating: number;

  description: string;

  isSale?: boolean;

  tags?: string[];

  isTrending?: boolean;

  isBestSeller?: boolean;
}