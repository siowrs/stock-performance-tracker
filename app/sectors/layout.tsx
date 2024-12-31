"use client";
import { useContext } from "react";
import { SelectorProvider } from "../lib/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SelectorProvider>{children}</SelectorProvider>;
}
