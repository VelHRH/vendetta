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
 const [participants, setParticipants] = useState<Json[]>([]);
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
    participants: [],
    type,
    time: time === "" ? undefined : time,
    show: parseFloat(show),
    tournament: tournament === "" ? undefined : parseFloat(tournament),
    winner: [],
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
     array={[
      "Одиночный матч",
      "Командный с 2 человеками",
      "Командный с 3 человеками",
      "Командный с 4 человеками",
      "Командный с 5 человеками",
      "Командный с 6 человеками",
      "Командный с 7 человеками",
      "Командный с 8 человеками",
      "Командный с 9 человеками",
      "Командный с 10 человеками",
     ]}
     value={type}
     setValue={setType}
     placeholder="Тип матча"
     className={`${isError && type.length === 0 && "border-red-500"}`}
    />
    <Input
     placeholder="Особенность"
     value={peculiarity}
     setValue={setPeculiarity}
    />
   </div>
   {type !== "" && (
    <div className="w-full">
     <Label size="medium" className="font-bold text-start mb-5">
      Участники:
     </Label>
     <div className="flex gap-3 flex-col">
      {participants.map((participant, index) => (
       <div key={index} className="flex w-full items-start gap-10">
        <Dropdown
         array={wrestlers!.map((w) => w.name || "")}
         placeholder={`Рестлер ${index + 1}`}
         value={participant.items![0].wrestlerName!}
         setValue={(newValue) => {
          if (newValue === "") return;
          setParticipants((prevItems) => {
           const newItems = [...prevItems];
           newItems[index] = {
            ...newItems[index],
            items: [
             {
              ...newItems[index].items![0],
              wrestlerName: newValue,
              wrestlerId: wrestlers!
               .find((wr) => wr.name === newValue)!
               .id.toString(),
              wrestlerImage: wrestlers!.find((wr) => wr.name === newValue)!
               .wrestler_img!,
             },
             ...newItems[index].items!.slice(1),
            ],
           };
           return newItems;
          });
         }}
        />
        <Input
         className="w-1/2"
         placeholder={`Имя в матче ${index + 1}`}
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
       className="w-full text-2xl"
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
       +
      </Button>
     </div>
    </div>
   )}
   <div className="w-full">
    <Label size="medium" className="font-bold text-start mb-5">
     Если матч уже прошел:
    </Label>
    <div className="grid grid-cols-3 gap-5 items-center">
     <Input placeholder="Время матча" value={time} setValue={setTime} />
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
