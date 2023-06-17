"use client";

import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
 return (
  <div className="text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-900 mt-[80px] w-full min-h-screen pb-5 px-10 transition-colors duration-300">
   <ThemeProvider enableSystem={true} attribute="class">
    {children}
   </ThemeProvider>
  </div>
 );
}
