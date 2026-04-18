import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { isAdmin } from "@/lib/clerk";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const admin = await isAdmin();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAdmin={admin} />
      <main className="flex-1 pt-14 md:pt-16 pb-16 md:pb-0">{children}</main>
      <Footer />
    </div>
  );
}
