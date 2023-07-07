import supabase from "@/lib/supabase-browser";
import { FC, useEffect, useState } from "react";
import TournamentBracket from "./TournamentBracket";
import Dropdown from "./ui/Dropdown";
import Input from "./ui/Input";

interface TournamentParticipantsProps {
 playOff: Json[];
 type: string;
}

function findFirstDuplicateIndex(arr: Json[]) {
 const seen = new Set();
 for (let i = 0; i < arr.length; i++) {
  const itemName = arr[i].itemName;
  if (seen.has(itemName)) {
   return i;
  }
  seen.add(itemName);
 }
 return -1;
}

const TournamentParticipants: FC<TournamentParticipantsProps> = ({
 playOff,
 type,
}) => {
 const [wrestlers, setWrestlers] = useState<
  Database["public"]["Tables"]["wrestlers"]["Row"][] | null
 >([]);
 const [number, setNumber] = useState<string>(
  findFirstDuplicateIndex(playOff) === -1
   ? ""
   : findFirstDuplicateIndex(playOff).toString()
 );
 const [items, setItems] = useState<
  {
   itemName: string;
   items: {
    wrestlerId: string;
    wrestlerName: string;
    wrestlerImage: string;
   }[];
  }[]
 >(
  Array(32).fill({
   itemName: "",
   items:
    type === "Обычный"
     ? [{ wrestlerId: "", wrestlerName: "", wrestlerImage: "" }]
     : Array(3).fill({ wrestlerId: "", wrestlerName: "", wrestlerImage: "" }),
  })
 );

 useEffect(() => console.log(items), [items]);

 useEffect(() => {
  const fetchData = async () => {
   const { data } = await supabase.from("wrestlers").select();
   setWrestlers(data);
  };
  fetchData();
 }, []);

 return (
  <div className="flex flex-col w-full gap-3 mt-7">
   <Dropdown
    placeholder="Количество участников"
    value={number}
    setValue={setNumber}
    array={["2", "4", "8", "16", "32"]}
   />
   {number && (
    <>
     {Array.from({ length: parseFloat(number) }, (_, index) => (
      <div key={index} className="flex w-full items-start gap-10">
       <Input
        className="w-1/2"
        placeholder={`Имя рестлера ${index + 1}`}
        value={items[index].itemName}
        setValue={(newValue) => {
         setItems((prevItems) => {
          const newItems = [...prevItems];
          newItems[index] = {
           ...newItems[index],
           itemName: newValue,
          };
          return newItems;
         });
        }}
       />
       <Dropdown
        className="flex-1"
        placeholder={`Выберите рестлера ${index + 1}`}
        array={wrestlers!.map((w) => w.name || "")}
        value={items[index].items[0].wrestlerName}
        setValue={(newValue) => {
         setItems((prevItems) => {
          const newItems = [...prevItems];
          newItems[index] = {
           ...newItems[index],
           items: [
            {
             ...newItems[index].items[0],
             wrestlerName: newValue,
             wrestlerId: wrestlers!
              .find((wr) => wr.name === newValue)!
              .id.toString(),
             wrestlerImage: wrestlers!.find((wr) => wr.name === newValue)!
              .wrestler_img!,
            },
            ...newItems[index].items.slice(1),
           ],
          };
          return newItems;
         });
        }}
       />
      </div>
     ))}

     <TournamentBracket
      participants={parseFloat(number)}
      items={items.slice(0, parseFloat(number))}
     />
    </>
   )}
  </div>
 );
};

export default TournamentParticipants;
