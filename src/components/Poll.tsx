'use client';

import { toast } from '@/hooks/use-toast';
import { countPollVotes } from '@/lib/utils';
import { User } from '@supabase/supabase-js';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './ui/Button';

interface PollProps {
  poll: Database['public']['Tables']['polls']['Row'];
  options: Database['public']['Tables']['poll_options']['Row'][];
  user: User | null;
}

const Poll = ({ poll, options, user }: PollProps) => {
  const [choice, setChoice] = useState<number>(-1);

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

  const isVoted = () => {
    for (let option of options) {
      if (user && option.voters.includes(user.id)) return true;
    }
    return false;
  };

  return (
    <div className="flex flex-col items-center mx-auto w-[40%] gap-3">
      <div className="text-3xl font-bold">{poll.name}</div>
      <div>{poll.description}</div>
      {options.map((option, index) => (
        <div
          key={option.id}
          className="border-2 border-slate-500 rounded-lg p-3 w-full flex justify-between"
        >
          <div className="w-[80%]">
            {option.url ? (
              <Link target="_blank" href={option.url} className="underline underline-offset-4">
                {option.name}
              </Link>
            ) : (
              option.name
            )}
          </div>
          {isVoted() ? (
            `${100 * (option.voters.length / allVoters)}%`
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
      ))}
      <div className="text-sm font-normal text-slate-500 mt-5">{allVoters} голосов</div>
      {!user ? (
        <div className="text-sm font-normal text-slate-500 mt-5">
          Авторизуйтесь чтобы голосовать
        </div>
      ) : (
        choice !== -1 &&
        !isVoted() && (
          <Button
            className="w-full hover:scale-105 transition"
            onClick={() => handleVote()}
            isLoading={isLoading}
          >
            Голосовать
          </Button>
        )
      )}
    </div>
  );
};

export default Poll;
