import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ok = await isAdmin();
  if (!ok) redirect("/admin/login");
  return <AdminShell>{children}</AdminShell>;
}
