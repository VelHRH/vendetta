import Poll from '@/components/Poll';
import createClient from '@/lib/supabase-server';
import { notFound } from 'next/navigation';

const PollPage = async ({ params }: { params: { id: string } }) => {
  const supabase = createClient();
  const { data: poll } = await supabase
    .from('polls')
    .select('*, poll_options(*)')
    .eq('id', params.id)
    .single();
  if (!poll) {
    notFound();
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <Poll poll={poll} options={poll.poll_options} user={user} />;
};

export default PollPage;
