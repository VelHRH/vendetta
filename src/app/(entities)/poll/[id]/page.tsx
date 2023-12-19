import Poll from '@/components/Poll';
import createClient from '@/lib/supabase-server';
import { User } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

const PollPage = async ({ params }: { params: { id: string } }) => {
  const supabase = createClient();
  const { data: polls } = await supabase.from('polls').select('*, poll_options(*)');
  const poll = polls?.find(p => p.id.toString() === params.id);
  if (!polls || !poll) {
    notFound();
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const nextPoll = polls.find(
    p => p.id !== poll.id && !p.isClosed && !isVoted(user, p.poll_options),
  );

  return (
    <Poll
      poll={poll}
      options={poll.poll_options}
      user={user}
      next={nextPoll?.id}
      isVoted={isVoted(user, poll.poll_options)}
    />
  );
};

const isVoted = (
  user: User | null,
  options: Database['public']['Tables']['poll_options']['Row'][],
): boolean => {
  for (let option of options) {
    if (user && option.voters.includes(user.id)) return true;
  }
  return false;
};

export default PollPage;
