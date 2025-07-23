import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Providers } from "./providers";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ensureAdminUser } from "@/lib/admin";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashtly",
  description: "Your new dashboard application",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  // Ensure admin user is set up on app startup
  await ensureAdminUser();

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header session={session} />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
