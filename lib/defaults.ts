import { FLAVOURS } from "@/data/flavours";
import {
  CONE_PRICING,
  NORMAL_CUP_OPTIONS,
  PACK_OPTIONS,
  SHAKE_SIZES,
} from "@/data/menu";
import type { Flavour } from "@/types/flavour";
import type { MenuPricingAll } from "@/types/menu";
import type { SiteSettings } from "@/types/settings";

export const defaultFlavours: Flavour[] = FLAVOURS.map((flavour, index) => ({
  id: flavour.id,
  name: flavour.name,
  color: flavour.color,
  isActive: true,
  sortOrder: index + 1,
  images: {
    cone: { png: flavour.imageSrc, webp: flavour.webpSrc },
    cup: { png: flavour.cupImageSrc, webp: flavour.cupWebpSrc },
    shake: {
      png: `/assets/shakes/${({ chocolate: "chocolate-chip", blueberry: "black-currant", pistachio: "pista" } as Record<string, string>)[flavour.id] ?? flavour.id}.png`,
      webp: `/assets/shakes/${({ chocolate: "chocolate-chip", blueberry: "black-currant", pistachio: "pista" } as Record<string, string>)[flavour.id] ?? flavour.id}.webp`,
    },
  },
  shakeNote: "",
  createdAt: "",
  updatedAt: "",
}));

export const defaultMenu: MenuPricingAll = {
  cones: { ...CONE_PRICING },
  cups: {
    sizes: NORMAL_CUP_OPTIONS.map(({ saving: _saving, ...option }) => option),
    packs: PACK_OPTIONS.map(({ saving: _saving, ...option }) => option),
  },
  shakes: { sizes: { ...SHAKE_SIZES } },
};

export const defaultSettings: SiteSettings = {
  storeName: "Cone Joy's",
  tagline: "Ice Cream Cones, Cups & Shakes",
  whatsappNumber: "+923407258700",
  phone: "+923407258700",
  address: "Chung, Multan Road, near Care Plus Medical Store, Lahore",
  mapCoords: { lat: 31.43180078514371, lng: 74.17333968704374 },
  storeHours: { open: "12:00", close: "00:00" },
  socialLinks: {
    instagram: "https://instagram.com/conejoys.official",
    tiktok: "https://tiktok.com/@conejoys.official",
    youtube: "https://youtube.com/@conejoys.official",
    whatsapp: "https://wa.me/923407258700",
  },
};
