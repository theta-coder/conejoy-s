export interface ConePricing {
  price: number;
  originalPrice: number;
  saving: number;
  updatedAt?: string;
}

export interface CupSizeOption {
  id: string;
  name: string;
  scoops: number;
  price: number;
  originalPrice: number;
}

export interface PackSizeOption {
  id: string;
  name: string;
  scoops: number;
  price: number;
  originalPrice: number;
}

export interface CupAndPackPricing {
  sizes: CupSizeOption[];
  packs: PackSizeOption[];
  updatedAt?: string;
}

export interface ShakeDetailOption {
  volume: string;
  price: number;
  originalPrice: number;
}

export interface ShakePricing {
  sizes: Record<string, ShakeDetailOption>;
  updatedAt?: string;
}

export interface MenuPricingAll {
  cones: ConePricing;
  cups: CupAndPackPricing;
  shakes: ShakePricing;
}
