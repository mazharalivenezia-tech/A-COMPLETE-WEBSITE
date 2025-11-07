
export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'men' | 'women' | 'kids';
  productType: 'Footwear' | 'Apparel' | 'Accessories';
  subCategory?: string;
  fashionCategory?: string;
  images: string[];
  colors: string[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  description: string;
  details: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface NavLink {
  name: string;
  path: string;
  children?: NavLink[];
}
