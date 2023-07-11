"use client";
import { useEffect, useState } from "react";
import Label from "../ui/Label";
import Input from "../ui/Input";
import { Button } from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { CreateMatchPayload } from "@/lib/validators/match";
import Dropdown from "../ui/Dropdown";
import supabase from "@/lib/supabase-browser";

const MatchForm = ({
 match,
}: {
 match?: Database["public"]["Tables"]["matches"]["Row"];
}) => {
 const [type, setType] = useState<string>(match?.type || "");
 const [time, setTime] = useState<string>(match?.time || "");
 const [peculiarity, setPeculiarity] = useState<string>(
  match?.peculiarity || ""
 );
 const [show, setShow] = useState<string>(match?.show.toString() || "");
 const [tournament, setTournament] = useState<string>(
  match?.tournament?.toString() || ""
 );
 const [participants, setParticipants] = useState<
  {
   itemName: string;
   items: { wrestlerName: string; wrestlerId: string; wrestlerImage: string }[];
  }[]
 >([]);
 const [winner, setWinner] = useState<string[]>([]);
 const [isError, setIsError] = useState<boolean>(false);

 const [wrestlers, setWrestlers] = useState<
  Database["public"]["Tables"]["wrestlers"]["Row"][] | null
 >([]);
 const [tournaments, setTournaments] = useState<
  Database["public"]["Tables"]["tournaments"]["Row"][] | null
 >([]);
 const [shows, setShows] = useState<
  Database["public"]["Tables"]["shows"]["Row"][] | null
 >([]);
 const [titles, setTitles] = useState<
  Database["public"]["Tables"]["titles"]["Row"][] | null
 >([]);

 const router = useRouter();

 useEffect(() => {
  const fetchData = async () => {
   const { data: wrestlers } = await supabase.from("wrestlers").select();
   setWrestlers(wrestlers);
   const { data: tournaments } = await supabase.from("tournaments").select();
   setTournaments(tournaments);
   const { data: shows } = await supabase.from("shows").select();
   setShows(shows);
   const { data: titles } = await supabase.from("titles").select();
   setTitles(titles);
  };
  fetchData();
 }, []);

 const { mutate: creatematch, isLoading } = useMutation({
  mutationFn: async () => {
   const payload: CreateMatchPayload = {
    participants,
    type: type === "" ? undefined : type,
    time: time === "" ? undefined : time,
    show: shows!.find((s) => s.name === show)
     ? shows!.find((s) => s.name === show)!.id
     : parseFloat(show),
    tournament: tournament === "" ? undefined : parseFloat(tournament),
    winner: winner.length === 0 ? undefined : winner,
   };
   const { data } = await axios.post("/api/match", payload);
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
   }
   toast({
    title: "There was an error",
    description: "Could not create the match",
    variant: "destructive",
   });
  },
  onSuccess: (data) => {
   router.push(`/match/${data}`);
   router.refresh();
  },
 });

 const { mutate: updatematch, isLoading: isLoadingUpdate } = useMutation({
  mutationFn: async () => {
   const payload: CreateMatchPayload = {
    participants: [],
    type,
    time: time === "" ? undefined : time,
    show: parseFloat(show),
    tournament: tournament === "" ? undefined : parseFloat(tournament),
    winner: [],
   };
   const { data } = await axios.put(`/api/match?id=${match!.id}`, payload);
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
   }
   toast({
    title: "There was an error",
    description: "Could not update the match",
    variant: "destructive",
   });
  },
  onSuccess: (data) => {
   router.push(`/match/${data}`);
   router.refresh();
  },
 });
 console.log(participants);
 return (
  <div className="flex flex-col items-center gap-10 w-full">
   <Label className="font-bold">
    {match ? "Редактирование матча..." : "Создание нового матча..."}
   </Label>
   <div className="grid grid-cols-3 gap-5 w-full">
    <Dropdown
     array={shows!.map((s) => s.name || "")}
     value={show}
     setValue={setShow}
     placeholder="Шоу"
     className={`${isError && show.length === 0 && "border-red-500"}`}
    />
    <Input placeholder="Тип матча" value={type} setValue={setType} />
    <Dropdown
     array={tournaments!.map((t) => t.name || "")}
     value={tournament}
     setValue={setTournament}
     placeholder="Турнир"
    />
   </div>
   <div className="w-full">
    <Label size="medium" className="font-bold text-start mb-5">
     Участники:
    </Label>
    <div className="flex gap-3 flex-col">
     {participants.map((participant, index) => (
      <div key={index} className="flex w-full items-start gap-10">
       <div className="flex flex-col gap-2 flex-1">
        {participant.items?.map((elem, index2) => (
         <Dropdown
          key={index2}
          array={wrestlers!.map((w) => w.name || "")}
          placeholder={`Рестлер ${index2 + 1}`}
          value={elem.wrestlerName!}
          setValue={(newValue) => {
           if (newValue === "") return;
           setParticipants((prevItems) => {
            const updatedParticipants = [...prevItems];
            updatedParticipants[index].items![index2].wrestlerName = newValue;
            updatedParticipants[index].items![index2].wrestlerId = wrestlers!
             .find((wr) => wr.name === newValue)!
             .id.toString();
            updatedParticipants[index].items![index2].wrestlerImage =
             wrestlers!.find((wr) => wr.name === newValue)!.wrestler_img!;
            return updatedParticipants;
           });
          }}
         />
        ))}
        <Button
         variant={"subtle"}
         className="w-full"
         onClick={() =>
          setParticipants((prevParticipants) => {
           const updatedParticipants = [...prevParticipants];
           const lastParticipant = updatedParticipants[index];
           const updatedItems = [
            ...lastParticipant.items!,
            { wrestlerName: "", wrestlerId: "", wrestlerImage: "" },
           ];
           lastParticipant.items = updatedItems;
           return updatedParticipants;
          })
         }
        >
         + Добавить члена команды
        </Button>
       </div>
       <Input
        className="w-1/2"
        placeholder={`Имя в матче`}
        value={participant.itemName!}
        setValue={(newValue) => {
         setParticipants((prevItems) => {
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
     <Button
      variant={"subtle"}
      className="w-full"
      onClick={() =>
       setParticipants((prev) => [
        ...prev,
        {
         itemName: "",
         items: [{ wrestlerName: "", wrestlerId: "", wrestlerImage: "" }],
        },
       ])
      }
     >
      + Добавить участника
     </Button>
    </div>
   </div>
   <div className="w-full">
    <Label size="medium" className="font-bold text-start mb-5">
     Если матч уже прошел:
    </Label>
    <div className="grid grid-cols-3 gap-5 items-center">
     <Input placeholder="Время матча" value={time} setValue={setTime} />
     {winner.map((win, index) => (
      <Dropdown
       key={index}
       array={participants.map((p) => p.itemName!)}
       value={win}
       setValue={(newValue) => {
        setWinner((prev) => {
         const newArray = [...prev];
         newArray[index] = newValue;
         return newArray;
        });
       }}
       placeholder={`Победитель ${index + 1}`}
      />
     ))}
     <Button
      variant={"subtle"}
      className="w-full"
      onClick={() => setWinner((prev) => [...prev, ""])}
     >
      + Добавить победителя
     </Button>
    </div>
   </div>
   <Button
    isLoading={isLoading || isLoadingUpdate}
    onClick={() => {
     setIsError(true);
     match ? updatematch() : creatematch();
    }}
    size="lg"
    className="w-1/2"
   >
    {match ? "Update" : "Create"}
   </Button>
  </div>
 );
};

export default MatchForm;
