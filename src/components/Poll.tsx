'use client';

import { toast } from '@/hooks/use-toast';
import { countPollVotes } from '@/lib/utils';
import { User } from '@supabase/supabase-js';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, buttonVariants } from './ui/Button';

interface PollProps {
  poll: Database['public']['Tables']['polls']['Row'];
  options: Database['public']['Tables']['poll_options']['Row'][];
  user: User | null;
  next: number | undefined;
  isVoted: boolean;
  allUsers: { id: string; username: string | null }[];
}

const Poll = ({ poll, options, user, next, isVoted, allUsers }: PollProps) => {
  const [choice, setChoice] = useState<number>(-1);
  const [showVoters, setShowVoters] = useState<number[]>([]);

  const router = useRouter();

  const allVoters = countPollVotes(options);

  const { mutate: handleVote, isLoading } = useMutation({
    mutationFn: async () => {
      const option_id = options[choice].id;
      const { data } = await axios.post(`/api/poll/vote`, { option_id, voter: user });
      return data as string;
    },
    onError: err => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 422) {
          return toast({
            title: 'Input error',
            description: 'Not all fields are filled out correctly',
            variant: 'destructive',
          });
        }
      }
      toast({
        title: 'There was an error',
        description: 'Could not vote',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleVotersClick = (index: number) => {
    if (showVoters.includes(index)) {
      setShowVoters(prev => prev.filter(el => el !== index));
    } else {
      setShowVoters(prev => [...prev, index]);
    }
  };

  return (
    <div className="flex flex-col items-center mx-auto w-[40%] gap-3">
      <div className="text-3xl font-bold">{poll.name}</div>
      <div>{poll.description}</div>
      {options.map((option, index) => (
        <div key={option.id} className="flex flex-col gap-1 w-full">
          <div className="border-2 border-slate-500 rounded-lg p-3 flex justify-between">
            <div className="w-[80%]">
              {option.url ? (
                <Link target="_blank" href={option.url} className="underline underline-offset-4">
                  {option.name}
                </Link>
              ) : (
                option.name
              )}
            </div>
            {isVoted || poll.isClosed ? (
              <div className="flex items-center gap-2">
                {user && option.voters.includes(user.id) && <Check />}
                {(100 * (option.voters.length / allVoters)).toFixed(2)}%
              </div>
            ) : choice !== index ? (
              <div
                onClick={() => setChoice(index)}
                className="cursor-pointer h-7 w-7 border-2 border-slate-500 rounded-lg aspect-square"
              ></div>
            ) : (
              <Check
                onClick={() => setChoice(-1)}
                className="bg-white text-slate-900 h-7 w-7 rounded-md cursor-pointer"
              />
            )}
          </div>
          {(isVoted || poll.isClosed) && option.voters.length !== 0 && (
            <div className="w-full flex flex-col gap-2 text-slate-500">
              <Button onClick={() => handleVotersClick(index)} variant={'subtle'}>
                <div className="text-slate-500 flex justify-between items-center mb-2 w-full h-full my-auto">
                  Избиратели {showVoters.includes(index) ? <ChevronUp /> : <ChevronDown />}
                </div>
              </Button>
              {showVoters.includes(index) &&
                allUsers.map(
                  u =>
                    option.voters.includes(u.id) && (
                      <Link
                        key={u.id}
                        href={`/user/${u.username}`}
                        className="underline underline-offset-4 px-5"
                      >
                        {u.username}
                      </Link>
                    ),
                )}
            </div>
          )}
        </div>
      ))}
      <div className="text-sm font-normal text-slate-500 mt-5">{allVoters} голосов</div>
      {poll.isClosed ? (
        <div className="text-sm font-normal text-slate-500 mt-5">Опрос закрыт</div>
      ) : !user ? (
        <div className="text-sm font-normal text-slate-500 mt-5">
          Авторизуйтесь чтобы голосовать
        </div>
      ) : !isVoted ? (
        choice !== -1 && (
          <Button
            className="w-full hover:scale-105 transition"
            onClick={() => handleVote()}
            isLoading={isLoading}
          >
            Голосовать
          </Button>
        )
      ) : (
        next && (
          <Link href={`/poll/${next}`} className={buttonVariants()}>
            Следующий опрос
          </Link>
        )
      )}
    </div>
  );
};

export default Poll;
