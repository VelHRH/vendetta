import SignOut from "@/components/Auth/SignOut";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
 return (
  <div className="flex flex-col gap-7">
   <div className="flex flex-col p-7 border-[3px] border-slate-300 dark:border-slate-700 rounded-md cursor-pointer duration-200 hover:bg-slate-200 dark:hover:bg-slate-800">
    <p className="text-4xl font-semibold mb-5 self-center">Next show</p>
    <div className="flex gap-5">
     <div className="flex flex-col gap-5 w-2/5">
      <div className="w-full p-5 border-2 border-slate-300 dark:border-slate-700 rounded-md text-3xl font-bold">
       <p>Better Place</p>
       <p className="mt-3 font-medium text-xl">September the 15th</p>
      </div>
      <div className="w-full flex-1 p-5 border-2 border-slate-300 dark:border-slate-700 rounded-md text-2xl font-semibold">
       <p>Matches to watch:</p>
      </div>
     </div>
     <div className="bg-red-500 rounded-md flex-1 aspect-video"></div>
    </div>
   </div>
   <div className="flex flex-col p-7 border-[3px] border-slate-300 dark:border-slate-700 rounded-md">
    <p className="text-4xl font-semibold mb-5 self-center">Previous shows</p>
    <div className="grid grid-cols-3 gap-4">
     <div className="bg-red-500 rounded-md aspect-video hover:bg-red-700 duration-200 cursor-pointer"></div>
     <div className="bg-red-500 rounded-md aspect-video hover:bg-red-700 duration-200 cursor-pointer"></div>
     <div className="bg-red-500 rounded-md aspect-video hover:bg-red-700 duration-200 cursor-pointer"></div>
    </div>
    <button className="text-lg self-center hover:underline duration-200 mt-3">
     More
    </button>
   </div>
  </div>
 );
}
