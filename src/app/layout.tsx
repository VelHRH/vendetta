import { AuthProvider } from "../components/Auth/AuthProvider";
import { Inter } from "next/font/google";
import createClient from "../lib/supabase-server";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
 title: "Vendetta",
 description: "Vendetta Federation",
};

export default async function RootLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 const supabase = createClient();

 const {
  data: { session },
 } = await supabase.auth.getSession();

 const accessToken = session?.access_token || null;
 return (
  <html lang="en">
   <body className={inter.className}>
    <AuthProvider accessToken={accessToken}>
     <Navbar />
     {children}
    </AuthProvider>
   </body>
  </html>
 );
}
