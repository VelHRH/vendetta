import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
 return (
  <>
   {Array(3).map((i) => (
    <Skeleton key={i} className="w-full h-10" />
   ))}
  </>
 );
}
