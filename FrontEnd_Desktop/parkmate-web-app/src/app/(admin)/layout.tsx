import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ClientAdminLayout from "@/components/layouts/ClientAdminLayout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // cookies() trả về Promise nên cần await
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/signin");
  }

  return <ClientAdminLayout>{children}</ClientAdminLayout>;
}
