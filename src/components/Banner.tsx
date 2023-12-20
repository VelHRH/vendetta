'use client';
import { CandyIcon, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const BANNER_KEY = 'bannerClosedUntil';

export const showBanner = (): boolean => {
  const bannerClosedUntil = localStorage.getItem(BANNER_KEY);
  const now = new Date().getTime();

  if (!bannerClosedUntil || parseFloat(bannerClosedUntil) <= now) {
    localStorage.removeItem(BANNER_KEY);
    return true;
  }
  return false;
};

const Banner = () => {
  const [isClosed, setIsClosed] = useState<boolean>(true);

  useEffect(() => {
    const isVisible = showBanner();
    if (isVisible) {
      setIsClosed(false);
    }
  }, []);
  const hideBanner = () => {
    setIsClosed(true);
    const expiry = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem(BANNER_KEY, expiry.toString());
  };
  return (
    <div
      className={`w-full ${
        isClosed ? 'h-0' : 'h-[50px]'
      } bg-teal-500 flex justify-center items-center text-slate-950 gap-10`}
    >
      <Link
        href={`/poll`}
        className="font-semibold underline underline-offset-4 flex items-center gap-1"
      >
        Участвуйте в новогодних голосованиях
        <CandyIcon />
        <Sparkles />
      </Link>
      <button onClick={hideBanner} className="bg-slate-950 text-teal-500 p-1 rounded-md">
        <X size={20} />
      </button>
    </div>
  );
};

export default Banner;
