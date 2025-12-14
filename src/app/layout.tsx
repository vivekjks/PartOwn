import type { Metadata } from "next";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { AppWrapper } from "@/components/app-wrapper";

export const metadata: Metadata = {
  title: "PartOwn - Community Asset Pools",
  description: "Co-own physical items with on-chain ownership, automated bookings, and fair usage scheduling",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <Providers>
          <AppWrapper>
            <Navbar />
            <main className="pt-16">
              {children}
            </main>
            <Toaster />
          </AppWrapper>
        </Providers>
        <VisualEditsMessenger />
      </body>
    </html>
  );
}