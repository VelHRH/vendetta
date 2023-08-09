import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
 return (
  <div className="flex flex-col gap-7">
   <Skeleton className="w-full h-1/2" />
   <div className="grid grid-cols-3 gap-4">
    {Array(10).map((i) => (
     <Skeleton key={i} />
    ))}
   </div>
  </div>
 );
}
