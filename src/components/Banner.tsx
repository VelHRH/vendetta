'use client';
import { CandyIcon, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const Banner = () => {
  const [isClosed, setIsClosed] = useState<boolean>(true);

  return (
    <div
      className={`w-full ${
        isClosed ? 'h-0' : 'h-[30px]'
      } bg-teal-500 flex justify-between items-center text-slate-950 gap-10 px-5`}
    >
      <Link
        href={`/poll`}
        className="font-semibold underline underline-offset-4 flex items-center justify-center gap-1 flex-1"
      >
        Участвуйте в новогодних голосованиях
        <CandyIcon />
        <Sparkles />
      </Link>
      <button
        onClick={() => setIsClosed(true)}
        className="bg-slate-950 text-teal-500 px-1 rounded-md"
      >
        <X size={20} />
      </button>
    </div>
  );
};

export default Banner;
