"use client";
import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { dark } from "@clerk/themes";
import { useDarkMode } from "@/hooks/use-dark-mode";

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const isDarkMode = useDarkMode();
  return (
    <ClerkProvider appearance={isDarkMode ? { baseTheme: dark } : undefined}>
      <ThemeProvider
        attribute={"class"}
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </ClerkProvider>
  );
};
