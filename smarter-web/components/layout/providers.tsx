"use client";

import ThemeProvider from "./theme/theme-provider";
import AuthListenerProvider from "../auth-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthListenerProvider />
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </>
  );
}
