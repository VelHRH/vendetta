"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
 const queryClient = new QueryClient();
 return (
  <QueryClientProvider client={queryClient}>
   <div className="text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-900 pt-[95px] lg:pt-[105px] w-full min-h-screen px-5 lg:px-10 transition-colors duration-200 pb-10">
    <ThemeProvider enableSystem={true} attribute="class">
     {children}
    </ThemeProvider>
   </div>
  </QueryClientProvider>
 );
}
