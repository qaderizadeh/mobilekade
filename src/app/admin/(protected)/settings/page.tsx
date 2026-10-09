import { getShippingConfig } from "@/lib/settings";
import { ShippingSettingsForm } from "@/components/admin/ShippingSettingsForm";

export const metadata = { title: "تنظیمات ارسال" };

export default async function SettingsPage() {
  const config = await getShippingConfig();
  return <ShippingSettingsForm initial={config} />;
}
