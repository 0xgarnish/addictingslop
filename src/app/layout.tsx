import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "AddictingSlop - The Games Steam Won't Sell",
  description: "AI-generated games, community-curated, zero gatekeeping. The home for games that got rejected everywhere else.",
  keywords: ["games", "ai games", "free games", "browser games", "indie games"],
  openGraph: {
    title: "AddictingSlop - The Games Steam Won't Sell",
    description: "AI-generated games, community-curated, zero gatekeeping.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
