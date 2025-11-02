//app/carreras/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "@/app/components/theme-provider";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Races",
  description: "Races | Calendar",
}

export default function CarrerasLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider>{children}</ThemeProvider>
    </Suspense>
  )
}