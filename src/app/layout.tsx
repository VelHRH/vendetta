import { AuthProvider } from '../components/Auth/AuthProvider';
import { PT_Mono, Roboto_Mono, Geologica } from 'next/font/google';
import createClient from '../lib/supabase-server';
import './globals.css';
import Navbar from '@/components/Navbar';
import { Providers } from '@/components/Providers';
import { Toaster } from '@/components/ui/Toaster';
import { cn } from '@/lib/utils';

const mono = Geologica({ subsets: ['latin'] });

export const metadata = {
  title: 'Vendetta',
  description: 'Vendetta Federation',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token || null;
  return (
    <html lang="en">
      <body className={cn(mono.className, 'antialiased')}>
        <AuthProvider accessToken={accessToken}>
          <Providers>
            <Navbar />
            {children}
            <Toaster />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
