import { prisma } from "./prisma";

export const SHIPPING_KEYS = {
  FREE_ENABLED: "shipping_free_enabled",
  FREE_MIN: "shipping_free_min",
  POST_ENABLED: "shipping_post_enabled",
  POST_PRICE: "shipping_post_price",
  POST_LABEL: "shipping_post_label",
  POST_DAYS: "shipping_post_days",
  TIPAX_ENABLED: "shipping_tipax_enabled",
  TIPAX_PRICE: "shipping_tipax_price",
  TIPAX_LABEL: "shipping_tipax_label",
  TIPAX_DAYS: "shipping_tipax_days",
} as const;

export type ShippingMethod = {
  id: "free" | "post" | "tipax";
  label: string;
  price: number;
  days: string;
  enabled: boolean;
  requiresMin?: number; // if free, minimum cart
};

const DEFAULTS: Record<string, string> = {
  [SHIPPING_KEYS.FREE_ENABLED]: "true",
  [SHIPPING_KEYS.FREE_MIN]: "2000000",
  [SHIPPING_KEYS.POST_ENABLED]: "true",
  [SHIPPING_KEYS.POST_PRICE]: "65000",
  [SHIPPING_KEYS.POST_LABEL]: "پست پیشتاز",
  [SHIPPING_KEYS.POST_DAYS]: "۳ تا ۷ روز کاری",
  [SHIPPING_KEYS.TIPAX_ENABLED]: "true",
  [SHIPPING_KEYS.TIPAX_PRICE]: "120000",
  [SHIPPING_KEYS.TIPAX_LABEL]: "تیپاکس",
  [SHIPPING_KEYS.TIPAX_DAYS]: "۱ تا ۳ روز کاری",
};

export async function getSetting(key: string): Promise<string> {
  const row = await prisma.setting.findUnique({ where: { key } });
  return row?.value ?? DEFAULTS[key] ?? "";
}

export async function getSettings(keys: string[]): Promise<Record<string, string>> {
  const rows = await prisma.setting.findMany({ where: { key: { in: keys } } });
  const map: Record<string, string> = {};
  for (const k of keys) map[k] = DEFAULTS[k] ?? "";
  for (const r of rows) map[r.key] = r.value;
  return map;
}

export async function setSetting(key: string, value: string) {
  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

export async function getShippingMethods(subtotal: number): Promise<ShippingMethod[]> {
  const keys = Object.values(SHIPPING_KEYS) as string[];
  const s = await getSettings(keys);

  const freeMin = Number(s[SHIPPING_KEYS.FREE_MIN]) || 0;
  const freeEnabled = s[SHIPPING_KEYS.FREE_ENABLED] === "true";
  const freeAvailable = freeEnabled && subtotal >= freeMin;

  const list: ShippingMethod[] = [];

  if (freeAvailable) {
    list.push({
      id: "free",
      label: "ارسال رایگان",
      price: 0,
      days: "۳ تا ۷ روز کاری",
      enabled: true,
    });
  }

  if (s[SHIPPING_KEYS.POST_ENABLED] === "true") {
    list.push({
      id: "post",
      label: s[SHIPPING_KEYS.POST_LABEL],
      price: Number(s[SHIPPING_KEYS.POST_PRICE]) || 0,
      days: s[SHIPPING_KEYS.POST_DAYS],
      enabled: true,
    });
  }

  if (s[SHIPPING_KEYS.TIPAX_ENABLED] === "true") {
    list.push({
      id: "tipax",
      label: s[SHIPPING_KEYS.TIPAX_LABEL],
      price: Number(s[SHIPPING_KEYS.TIPAX_PRICE]) || 0,
      days: s[SHIPPING_KEYS.TIPAX_DAYS],
      enabled: true,
    });
  }

  return list;
}

export async function getShippingConfig() {
  const keys = Object.values(SHIPPING_KEYS) as string[];
  return getSettings(keys);
}
