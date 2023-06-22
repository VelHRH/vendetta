import Label from "@/components/ui/Label";

export default async function Home() {
 return (
  <div className="flex flex-col gap-7">
   <div className="flex flex-col p-7 border-[3px] border-slate-300 dark:border-slate-700 rounded-md cursor-pointer duration-200 hover:bg-slate-200 dark:hover:bg-slate-800">
    <Label className="mb-5 font-semibold">Next show</Label>
    <div className="flex gap-5">
     <div className="flex flex-col gap-5 w-2/5">
      <div className="w-full p-5 border-2 border-slate-300 dark:border-slate-700 rounded-md">
       <Label className="text-3xl font-bold">Better Place</Label>
       <Label size="small" className="font-medium mt-3">
        September the 15th
       </Label>
      </div>
      <div className="w-full flex-1 p-5 border-2 border-slate-300 dark:border-slate-700 rounded-md">
       <Label className="font-semibold" size="medium">
        Matches to watch:
       </Label>
      </div>
     </div>
     <div className="bg-red-500 rounded-md flex-1 aspect-video"></div>
    </div>
   </div>
   <div className="flex flex-col p-7 border-[3px] border-slate-300 dark:border-slate-700 rounded-md">
    <Label className="mb-5 font-semibold">Previous showsw</Label>
    <div className="grid grid-cols-3 gap-4">
     <div className="bg-red-500 rounded-md aspect-video hover:bg-red-700 duration-200 cursor-pointer"></div>
     <div className="bg-red-500 rounded-md aspect-video hover:bg-red-700 duration-200 cursor-pointer"></div>
     <div className="bg-red-500 rounded-md aspect-video hover:bg-red-700 duration-200 cursor-pointer"></div>
    </div>
    <button className="text-lg self-center hover:underline font-semibold underline-offset-4 mt-3">
     More
    </button>
   </div>
  </div>
 );
}
