import { z } from "zod";

const imageFormatsSchema = z.object({
  png: z.string().trim().max(2048),
  webp: z.string().trim().max(2048),
});

export const flavourCreateSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase URL-safe slug."),
  name: z.string().trim().min(1).max(80),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a six-digit hex colour."),
  isActive: z.boolean(),
  sortOrder: z.number().int().min(0).max(999),
  images: z.object({
    cone: imageFormatsSchema,
    cup: imageFormatsSchema,
    shake: imageFormatsSchema,
  }),
  shakeNote: z.string().trim().max(240).optional().default(""),
});

export const flavourUpdateSchema = flavourCreateSchema
  .omit({ id: true })
  .partial();

const priceSchema = z.number().finite().min(0).max(1_000_000);
const menuOptionSchema = z.object({
  id: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1).max(100),
  scoops: z.number().int().min(1).max(100),
  price: priceSchema,
  originalPrice: priceSchema,
});

export const menuSchemas = {
  cones: z.object({
    price: priceSchema,
    originalPrice: priceSchema,
    saving: priceSchema.optional(),
  }),
  cups: z.object({
    sizes: z.array(menuOptionSchema).min(1).max(20),
    packs: z.array(menuOptionSchema).min(1).max(20),
  }),
  shakes: z.object({
    sizes: z.record(
      z.string(),
      z.object({
        volume: z.string().trim().min(1).max(40),
        price: priceSchema,
        originalPrice: priceSchema,
      }),
    ),
  }),
} as const;

export const orderItemSchema = z.object({
  id: z.string().trim().min(1).max(120),
  type: z.enum(["Cone", "Cup", "Pack", "Shake"]),
  flavour: z.string().trim().min(1).max(120),
  size: z.string().trim().max(80).optional(),
  quantity: z.number().int().min(1).max(100),
  unitPrice: priceSchema,
  flavourBreakdownText: z.string().trim().max(500).optional(),
});

export const orderCreateSchema = z
  .object({
    customerName: z.string().trim().min(1).max(120),
    customerPhone: z.string().trim().min(7).max(30),
    customerAddress: z.string().trim().max(500).optional(),
    items: z.array(orderItemSchema).min(1).max(100),
    subtotal: priceSchema,
    deliveryFee: priceSchema.default(0),
    total: priceSchema,
    status: z
      .enum(["pending", "confirmed", "preparing", "delivered", "cancelled"])
      .default("pending"),
    notes: z.string().trim().max(1000).optional(),
    source: z.enum(["whatsapp", "admin_manual", "website"]).default("admin_manual"),
  })
  .refine((value) => value.total === value.subtotal + value.deliveryFee, {
    message: "Total must equal subtotal plus delivery fee.",
    path: ["total"],
  });

export const orderUpdateSchema = z.object({
  status: z.enum(["pending", "confirmed", "preparing", "delivered", "cancelled"]).optional(),
  notes: z.string().trim().max(1000).optional(),
  customerName: z.string().trim().min(1).max(120).optional(),
  customerPhone: z.string().trim().min(7).max(30).optional(),
  customerAddress: z.string().trim().max(500).optional(),
});

export const bannerCreateSchema = z.object({
  title: z.string().trim().min(1).max(120),
  imageUrl: z.string().trim().min(1).max(2048),
  storagePath: z.string().trim().max(500).optional(),
  linkTo: z
    .string()
    .trim()
    .max(500)
    .refine((value) => !value || value.startsWith("/"), "Use an internal path beginning with /.")
    .optional(),
  isActive: z.boolean(),
  sortOrder: z.number().int().min(0).max(999),
});

export const bannerUpdateSchema = bannerCreateSchema.partial();

export const settingsSchema = z.object({
  storeName: z.string().trim().min(1).max(120),
  tagline: z.string().trim().max(200),
  whatsappNumber: z.string().trim().min(7).max(30),
  phone: z.string().trim().min(7).max(30),
  address: z.string().trim().min(1).max(500),
  mapCoords: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    iframeSrc: z.string().trim().max(3000).optional(),
  }),
  storeHours: z.object({
    open: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    close: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  }),
  socialLinks: z.object({
    instagram: z.string().trim().max(500).optional(),
    tiktok: z.string().trim().max(500).optional(),
    youtube: z.string().trim().max(500).optional(),
    facebook: z.string().trim().max(500).optional(),
    whatsapp: z.string().trim().max(500).optional(),
  }),
});
