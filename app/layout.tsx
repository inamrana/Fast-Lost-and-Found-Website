import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { readCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Fast Lost & Found",
  description: "A Vercel-ready lost and found web application with smart matching, auth, roles, and admin verification."
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await readCurrentUser();
  return (
    <html lang="en">
      <body>
        <Navbar user={user} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
