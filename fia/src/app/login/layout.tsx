import type { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
  title: "Login",
  description: "Página de inicio de sesión",
  generator: "Next.js", 
};


export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</> 
  );
}