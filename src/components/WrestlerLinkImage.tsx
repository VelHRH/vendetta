import Link from "next/link";
import { FC } from "react";
import Image from "next/image";

interface WrestlerLinkImageProps {
 wrestler: Json;
}

const WrestlerLinkImage: FC<WrestlerLinkImageProps> = ({ wrestler }) => {
 return (
  <Link
   href={`/wrestler/${wrestler.wrestlerId}`}
   key={wrestler.wrestlerId}
   className={`aspect-square cursor-pointer relative flex flex-col justify-center`}
  >
   <div className="text-center break-words font-bold text-md lg:text-xl">
    {wrestler.wrestlerCurName}
   </div>
   <Image
    src={wrestler.wrestlerImage!}
    alt={wrestler.wrestlerCurName}
    fill
    className="object-cover hover:opacity-0 duration-300 rounded-md"
   />
  </Link>
 );
};

export default WrestlerLinkImage;
