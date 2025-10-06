//app/carreras/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/react";
import "@/app/components/ui/global.css";
import { ThemeProvider } from "@/app/components/theme-provider";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Races",
  description: "Races | Calendar",
  generator: "",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <ThemeProvider>{children}</ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
  )
}
