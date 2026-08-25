export interface SiteSettings {
  storeName: string;
  tagline: string;
  whatsappNumber: string;
  phone: string;
  address: string;
  mapCoords: {
    lat: number;
    lng: number;
    iframeSrc?: string;
  };
  storeHours: {
    open: string;
    close: string;
  };
  socialLinks: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    whatsapp?: string;
  };
  updatedAt?: string;
}
