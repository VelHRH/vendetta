'use client';

import { User } from '@supabase/supabase-js';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface PollProps {
  poll: Database['public']['Tables']['polls']['Row'];
  options: Database['public']['Tables']['poll_options']['Row'][];
  user: User | null;
}

const Poll = ({ poll, options }: PollProps) => {
  const [choice, setChoice] = useState<number>(-1);
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
          {choice !== index ? (
            <div
              onClick={() => setChoice(index)}
              className="cursor-pointer h-7 w-7 border-2 border-slate-500 rounded-lg aspect-square"
            ></div>
          ) : (
            <Check className="bg-white text-slate-900 h-7 w-7 rounded-md cursor-pointer" />
          )}
        </div>
      ))}
    </div>
  );
};

export default Poll;
