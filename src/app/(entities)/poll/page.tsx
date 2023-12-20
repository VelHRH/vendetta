import createClient from '@/lib/supabase-server';
import { Metadata } from 'next';
import Label from '@/components/ui/Label';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { countPollVotes } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Опросы',
  description: 'Опросы о Vendetta',
};

const Polls = async () => {
  const supabase = createClient();
  const { data: polls } = await supabase
    .from('polls')
    .select('*, poll_options(*)')
    .order('created_at', { ascending: false });
  if (!polls) notFound();
  return (
    <div className="w-full font-semibold">
      <Label className="font-bold mb-5 justify-center">Опросы</Label>
      <div className="grid grid-cols-3 gap-5">
        {polls?.map(poll => (
          <Link
            href={`/poll/${poll.id}`}
            key={poll.id}
            className="dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 rounded-lg p-5 text-center cursor-pointer hover:scale-105 duration-300"
          >
            <div className="text-2xl">{poll.name}</div>
            <div className="font-normal">{poll.description}</div>
            <div className="text-sm font-normal text-slate-500 mt-5 flex gap-3 justify-center items-center">
              {countPollVotes(poll.poll_options)} голосов{' '}
              <div
                className={`w-2 aspect-square rounded-full ${
                  poll.isClosed ? 'bg-red-500' : 'bg-green-500'
                }`}
              ></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default Polls;
