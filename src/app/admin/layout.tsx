import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminSidebar, AdminHeader } from "@/components/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="lg:pl-64 transition-all duration-300">
        <AdminHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
