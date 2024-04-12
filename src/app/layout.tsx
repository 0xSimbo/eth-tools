// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required

import { DM_Sans } from "next/font/google";
import { Rethink_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SidebarContainer } from "@/components/SidebarContainer";

const dm_sans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm_sans",
});
const rethink_sans = Rethink_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rethink_sans",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SidebarContainer>{children}</SidebarContainer>
        <Toaster />
      </body>
    </html>
  );
}
