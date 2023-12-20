import InfoElement from '@/components/InfoElement';
import LastCommets from '@/components/LastCommets';
import PreviousShows from '@/components/PreviousShows';
import Label from '@/components/ui/Label';
import createClient from '@/lib/supabase-server';
import { parseSide, sortSides } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function Home() {
  const supabase = createClient();

  const { data: shows } = await supabase.from('shows').select('*, matches(*, match_sides(*))');
  if (!shows) {
    notFound();
  }
  const nextShow = shows
    .filter(s => s.upload_date === null)
    .sort((a, b) => a.created_at!.localeCompare(b.created_at!))[0];
  return (
    <div className="flex flex-col gap-7">
      {nextShow && (
        <Link
          href={`/show/${nextShow.id}`}
          className="flex flex-col p-3 lg:p-7 border-[3px] border-slate-300 dark:border-slate-700 rounded-md cursor-pointer duration-200 hover:bg-slate-200 dark:hover:bg-slate-800"
        >
          <Label className="mb-5 font-semibold">Next show</Label>

          <div key={nextShow.id} className="flex flex-col lg:flex-row gap-3 lg:gap-5">
            <div className="flex flex-col gap-3 lg:gap-5 w-full lg:w-2/5">
              <div className="w-full p-3 lg:p-5 border-2 border-slate-300 dark:border-slate-700 rounded-md flex flex-col gap-2 lg:gap-4 items-start">
                <Label className="lg:text-3xl font-bold">
                  {nextShow.name.includes('[')
                    ? nextShow.name.slice(
                        nextShow.name.indexOf('[') + 1,
                        nextShow.name.indexOf(']'),
                      )
                    : nextShow.name}{' '}
                </Label>
                <InfoElement>
                  <p className="text-lg lg:text-2xl font-medium">January 2024</p>
                </InfoElement>
              </div>
              <div className="w-full flex-1 p-3 lg:p-5 border-2 border-slate-300 dark:border-slate-700 rounded-md">
                <Label className="font-bold" size="medium">
                  Matches to watch:
                </Label>
                <div className="flex flex-col text-xl gap-2 lg:gap-3 mt-3 lg:mt-5 items-start">
                  {nextShow.matches
                    .sort((a, b) => b.order - a.order)
                    .slice(0, 5)
                    .map((match, index) => (
                      <InfoElement key={index}>
                        {index + 1}.{' '}
                        {sortSides(match.match_sides)
                          .map(
                            (s, i) =>
                              `${parseSide(s.wrestlers)} ${
                                i !== match.match_sides.length - 1 ? ' vs. ' : ''
                              }`,
                          )
                          .join(' ')}
                      </InfoElement>
                    ))}
                </div>
              </div>
            </div>
            <div className="rounded-md flex-1 aspect-video relative">
              <Image
                src={
                  nextShow.show_img
                    ? nextShow.show_img
                    : 'https://brytpkxacsmzbawwiqcr.supabase.co/storage/v1/object/public/wrestlers/posters/default.jpg'
                }
                alt={nextShow.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </Link>
      )}
      <PreviousShows shows={shows} />
      <LastCommets />
    </div>
  );
}
