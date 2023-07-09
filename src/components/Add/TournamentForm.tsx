"use client";
import supabase from "@/lib/supabase-browser";
import { useEffect, useState } from "react";
import Label from "../ui/Label";
import Input from "../ui/Input";
import { Button } from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Dropdown from "../ui/Dropdown";
import InfoLabel from "../ui/InfoLabel";
import TournamentBracket from "../TournamentBracket";
import { CreateTournamentPayload } from "@/lib/validators/tournament";
import { findFirstDuplicate } from "@/lib/utils";

const TournamentForm = ({
 tournament,
}: {
 tournament?: Database["public"]["Tables"]["tournaments"]["Row"];
}) => {
 const [name, setName] = useState<string>(tournament?.name || "");
 const [description, setDescription] = useState<string>(
  tournament?.description || ""
 );
 const [dateStart, setDateStart] = useState<string>(tournament?.start || "");
 const [dateEnd, setDateEnd] = useState<string>(tournament?.end || "");
 const [type, setType] = useState<string>(tournament?.type || "");
 const [playOff, setPlayOff] = useState<
  {
   itemName: string;
   items: {
    wrestlerId: string;
    wrestlerName: string;
    wrestlerImage: string;
   }[];
  }[]
 >(
  tournament?.play_off_participants.length! > 0
   ? tournament?.play_off_participants!
   : Array(32).fill({
      itemName: "",
      items:
       type === "Обычный"
        ? [{ wrestlerId: "", wrestlerName: "", wrestlerImage: "" }]
        : Array(3).fill({
           wrestlerId: "",
           wrestlerName: "",
           wrestlerImage: "",
          }),
     })
 );
 const [blocks, setBlocks] = useState<string[] | undefined>(undefined);
 const [isError, setIsError] = useState<boolean>(false);

 const [wrestlers, setWrestlers] = useState<
  Database["public"]["Tables"]["wrestlers"]["Row"][] | null
 >([]);
 const [number, setNumber] = useState<string>(
  findFirstDuplicate(playOff).index === -1 ||
   findFirstDuplicate(playOff).value === ""
   ? ""
   : findFirstDuplicate(playOff).index.toString()
 );

 useEffect(() => {
  const fetchData = async () => {
   const { data } = await supabase.from("wrestlers").select();
   setWrestlers(data);
  };
  fetchData();
 }, []);

 const router = useRouter();

 const { mutate: createTournament, isLoading } = useMutation({
  mutationFn: async () => {
   let play_off_participants = playOff.slice(0, parseFloat(number));
   play_off_participants = play_off_participants.map((item) => {
    item.items = item.items.filter(
     (subItem, index) =>
      index === 0 || Object.values(subItem).some((value) => value !== "")
    );
    return item;
   });
   const payload: CreateTournamentPayload = {
    name,
    description,
    start: dateStart,
    end: dateEnd,
    play_off_participants,
    block_participants: blocks,
    type,
   };
   const { data } = await axios.post("/api/tournament", payload);
   return data as string;
  },
  onError: (err) => {
   if (err instanceof AxiosError) {
    if (err.response?.status === 422) {
     return toast({
      title: "Input error",
      description: "Not all fields are filled out correctly",
      variant: "destructive",
     });
    }

    if (err.response?.status === 400) {
     return toast({
      title: "There was an error",
      description: err.response.data,
      variant: "destructive",
     });
    }
   }
   toast({
    title: "There was an error",
    description: "Could not create the tournament",
    variant: "destructive",
   });
  },
  onSuccess: (data) => {
   router.push(`/tournament/${data}`);
   router.refresh();
  },
 });

 return (
  <div className="flex flex-col items-center gap-10 w-full">
   <Label className="font-bold">
    {tournament ? "Редактирование турнира..." : "Создание нового турнира..."}
   </Label>
   <div className="grid grid-cols-3 gap-5 w-full">
    <Input
     placeholder="Название турнира"
     value={name}
     setValue={setName}
     isError={isError && name.length === 0}
    />
    <Input
     placeholder="Описание турнира"
     value={description}
     setValue={setDescription}
     isError={isError && description.length === 0}
    />
    <Dropdown
     placeholder="Тип турнира"
     array={["Round-robin", "Обычный"]}
     value={type}
     setValue={setType}
    />
    <Input
     placeholder="Начало турнира"
     value={dateStart}
     setValue={setDateStart}
     type="date"
    />
    <Input
     placeholder="Конец турнира"
     value={dateEnd}
     setValue={setDateEnd}
     type="date"
    />
   </div>
   {type === "Обычный" && (
    <div className="w-full">
     <Label size="medium" className="font-bold text-start mb-5">
      Добавление участников:
     </Label>
     <InfoLabel>
      Вы выбрали обычный тип для турнира. Это значит что вы должны выбрать
      количество участников и записать рестлеров в соответствующие ячейки. Слева
      выбирается рестлер из существующих. Справа - имя, под которым он будет
      выступать. Результрующая таблица показана ниже.
     </InfoLabel>
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
          <Dropdown
           className="flex-1"
           placeholder={`Выберите рестлера ${index + 1}`}
           array={wrestlers!.map((w) => w.name || "")}
           value={playOff[index].items[0].wrestlerName}
           setValue={(newValue) => {
            if (newValue === "") return;
            setPlayOff((prevItems) => {
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
          <Input
           className="w-1/2"
           placeholder={`Имя рестлера ${index + 1}`}
           value={playOff[index].itemName}
           setValue={(newValue) => {
            setPlayOff((prevItems) => {
             const newItems = [...prevItems];
             newItems[index] = {
              ...newItems[index],
              itemName: newValue,
             };
             return newItems;
            });
           }}
          />
         </div>
        ))}

        <TournamentBracket
         participants={parseFloat(number)}
         items={playOff.slice(0, parseFloat(number))}
        />
       </>
      )}
     </div>
    </div>
   )}
   <Button
    onClick={() => {
     setIsError(true);
     createTournament();
    }}
    size="lg"
    className="w-1/2"
    isLoading={isLoading}
   >
    Create
   </Button>
  </div>
 );
};

export default TournamentForm;
