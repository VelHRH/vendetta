import { ReactNode } from 'react';

import Label from '@/components/ui/Label';
import { notFound } from 'next/navigation';
import SectionButton from '@/components/SectionButton';
import { buttonVariants } from '@/components/ui/Button';
import { Pencil } from 'lucide-react';
import Link from 'next/link';
import createClient from '@/lib/supabase-server';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: show } = await supabase.from('shows').select('*').eq('id', params.id).single();
  if (!show) {
    notFound();
  }

  return { title: show.name };
}

interface LayoutProps {
  children: ReactNode;
  params: { id: string };
}

const Layout = async ({ children, params }: LayoutProps) => {
  const supabase = createClient();
  const { data: show } = await supabase.from('shows').select('*').eq('id', params.id).single();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!show) {
    notFound();
  }
  return (
    <div className="flex flex-col gap-5 items-center">
      <div className="flex gap-2">
        <Label className="font-bold">{show?.name!}</Label>
        {user &&
          (user.id === '41608919-15c0-4bbd-b91e-b3407a0c3520' ||
            user.id === '4caeee0b-5b66-4ba0-9fad-2c1ba9284238') && (
            <Link
              href={`/show/edit?id=${show.id}`}
              className={buttonVariants({ variant: 'subtle' })}
            >
              <Pencil />
            </Link>
          )}
      </div>
      <div className="flex gap-2">
        <SectionButton link={`/show/${params.id}`} isMain={2}>
          Обзор
        </SectionButton>
        <SectionButton link={`/show/${params.id}/card`}>Кард</SectionButton>
      </div>
      {children}
    </div>
  );
};

export default Layout;
