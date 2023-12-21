import ShowForm from '@/components/Add/ShowForm';
import createClient from '@/lib/supabase-server';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Исправление шоу',
  description: 'Исправление шоу',
};

const EditShow = async ({ searchParams }: { searchParams: { id: string } }) => {
  const supabase = createClient();
  const { data: show } = await supabase
    .from('shows')
    .select('*')
    .eq('id', searchParams.id)
    .single();
  return <ShowForm show={show!} />;
};

export default EditShow;
