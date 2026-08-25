export interface ImageFormats {
  png: string;
  webp: string;
}

export interface FlavourImages {
  cone: ImageFormats;
  cup: ImageFormats;
  shake: ImageFormats;
}

export interface Flavour {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
  sortOrder: number;
  images: FlavourImages;
  shakeNote?: string;
  createdAt: string;
  updatedAt: string;
}
