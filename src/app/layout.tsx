import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { Providers } from "./providers";

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

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <header className="bg-white shadow">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
              <div className="flex lg:flex-1">
                <Link href="/" className="-m-1.5 p-1.5 text-xl font-bold">
                  Dashtly
                </Link>
              </div>
              <div className="flex flex-1 justify-end">
                {session ? (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      Welcome, {session.user?.name}
                    </span>
                    <Link
                      href="/api/auth/signout"
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      Sign out
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Link
                      href="/login"
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/register"
                      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </header>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
