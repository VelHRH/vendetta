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
import InfoLabel from "../ui/InfoLabel";

const MatchForm = ({ match }: { match?: any }) => {
 const [type, setType] = useState<string>(match?.type || "");
 const [title, setTitle] = useState<string[]>(match?.challenges || []);
 const [order, setOrder] = useState<string>(match?.order.toString() || "");
 const [time, setTime] = useState<string>(match?.time || "");
 const [show, setShow] = useState<string>(match?.show.toString() || "");
 const [tournament, setTournament] = useState<string>(
  match?.tournament?.toString() || ""
 );
 const [participants, setParticipants] = useState<
  {
   wrestlerName: string;
   wrestlerCurName: string;
   wrestlerId: string;
   wrestlerImage: string;
   teamName?: string;
   teamId?: string;
  }[][]
 >(match?.match_sides || []);
 const [ending, setEnding] = useState<string>("");
 const [winner, setWinner] = useState<string[]>([""]);
 const [teamNames, setTeamNames] = useState<
  { name: string; wrestlers: string[] }[]
 >([]);

 const [isError, setIsError] = useState<boolean>(false);

 const [wrestlers, setWrestlers] = useState<
  Database["public"]["Tables"]["wrestlers"]["Row"][]
 >([]);
 const [tournaments, setTournaments] = useState<
  Database["public"]["Tables"]["tournaments"]["Row"][]
 >([]);
 const [teams, setTeams] = useState<
  Database["public"]["Tables"]["teams"]["Row"][]
 >([]);
 const [shows, setShows] = useState<
  Database["public"]["Tables"]["shows"]["Row"][]
 >([]);
 const [titles, setTitles] = useState<
  Database["public"]["Tables"]["titles"]["Row"][]
 >([]);

 const router = useRouter();

 useEffect(() => {
  const fetchData = async () => {
   const { data: wrestlers } = await supabase.from("wrestlers").select();
   setWrestlers(wrestlers || []);
   const { data: tournaments } = await supabase.from("tournaments").select();
   setTournaments(tournaments || []);
   const { data: shows } = await supabase.from("shows").select();
   setShows(shows || []);
   const { data: titles } = await supabase.from("titles").select();
   setTitles(titles || []);
   const { data: teams } = await supabase.from("teams").select();
   setTeams(teams || []);
  };
  fetchData();
 }, []);

 const handleAddTeammate = (index: number) => {
  const firstParticipant = participants[index][0];
  const updatedFirstParticipant = {
   ...firstParticipant,
   teamName: "",
   teamId: "",
  };

  const updatedParticipants = [...participants];
  updatedParticipants[index] = [
   updatedFirstParticipant,
   ...participants[index].slice(1),
  ];
  updatedParticipants[index].push({
   wrestlerName: "",
   wrestlerId: "",
   wrestlerImage: "",
   wrestlerCurName: "",
   teamName: "",
   teamId: "",
  });
  setParticipants(updatedParticipants);
 };

 console.log(participants);

 const { mutate: creatematch, isLoading } = useMutation({
  mutationFn: async () => {
   const payload: CreateMatchPayload = {
    participants: [],
    ending: ending === "" ? "удержанием" : ending,
    type: type === "" ? undefined : type,
    time: time === "" ? undefined : time,
    show: shows!.find((s) => s.name === show)
     ? shows!.find((s) => s.name === show)!.id
     : parseFloat(show),
    tournament: tournament === "" ? undefined : parseFloat(tournament),
    winner:
     winner.filter((w) => w.length > 0).length === 0
      ? undefined
      : winner.filter((w) => w.length > 0),
    title:
     titles!.filter((t) => title.includes(t.name)).length === 0
      ? undefined
      : titles!
         .filter((t) => title.includes(t.name))
         .map((t) => ({ id: t.id, name: t.name })),
    order: parseFloat(order),
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
    ending: ending === "" ? "удержанием" : ending,
    type: type === "" ? undefined : type,
    time: time === "" ? undefined : time,
    show: shows!.find((s) => s.name === show)
     ? shows!.find((s) => s.name === show)!.id
     : parseFloat(show),
    tournament: tournament === "" ? undefined : parseFloat(tournament),
    winner:
     winner.filter((w) => w.length > 0).length === 0
      ? undefined
      : winner.filter((w) => w.length > 0),
    title:
     titles!.filter((t) => title.includes(t.name)).length === 0
      ? undefined
      : titles!
         .filter((t) => title.includes(t.name))
         .map((t) => ({ id: t.id, name: t.name })),
    order: parseFloat(order),
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
 return (
  <div className="flex flex-col items-center gap-10 w-full">
   <Label className="font-bold">
    {match ? "Редактирование матча..." : "Создание нового матча..."}
   </Label>

   <div className="grid grid-cols-3 gap-5 w-full items-center">
    <Dropdown
     array={shows.map((s) => s.name || "")}
     value={show}
     setValue={setShow}
     placeholder="Шоу"
     className={`${isError && show.length === 0 && "border-red-500"}`}
    />
    <Input
     placeholder="Последовательность на шоу"
     value={order}
     setValue={setOrder}
     isError={isError && order.length === 0}
    />
    <Input
     placeholder="Тип/особенность матча"
     value={type}
     setValue={setType}
    />
    <Dropdown
     array={tournaments.map((t) => t.name || "")}
     value={tournament}
     setValue={setTournament}
     placeholder="Турнир"
    />
    {title.map((t, index) => (
     <Dropdown
      key={index}
      array={titles?.map((p) => p.name!) || []}
      value={t}
      setValue={(newValue) => {
       setTitle((prev) => {
        const newArray = [...prev];
        newArray[index] = newValue;
        return newArray;
       });
      }}
      placeholder={`Титул ${index + 1}`}
     />
    ))}
    <Button
     variant={"subtle"}
     className="w-full"
     onClick={() => setTitle((prev) => [...prev, ""])}
    >
     + Добавить титул
    </Button>
   </div>
   <div className="w-full">
    <Label size="medium" className="font-bold text-start mb-5">
     Участники:
    </Label>
    <InfoLabel>
     Вы можете установить свое имя, если не хотите использовать имена рестлеров
     по умолчанию, или оставить правые поля пустыми. Если вы записываете
     команды, важно перечислять рестлеров слева и справа в одном порядке, а
     также разделять их &.
    </InfoLabel>
    <div className="flex gap-3 flex-col mt-3">
     {participants.map((participant, index) => (
      <div key={index} className="flex w-full items-start gap-10">
       <div className="flex flex-col gap-2 flex-1">
        {participant.map((elem, index2) => (
         <Dropdown
          key={index2}
          array={wrestlers!.map((w) => w.name || "")}
          placeholder={`Рестлер ${index2 + 1}`}
          value={elem.wrestlerName}
          setValue={(newValue) => {
           if (newValue === "") return;
           setParticipants((prevItems) => {
            const updatedParticipants = [...prevItems];
            updatedParticipants[index][index2].wrestlerName = newValue;
            updatedParticipants[index][index2].wrestlerId = wrestlers!
             .find((wr) => wr.name === newValue)!
             .id.toString();
            updatedParticipants[index][index2].wrestlerImage = wrestlers!.find(
             (wr) => wr.name === newValue
            )!.wrestler_img!;
            return updatedParticipants;
           });
          }}
         />
        ))}
        <Button
         variant={"subtle"}
         className="w-full"
         onClick={() => handleAddTeammate(index)}
        >
         + Добавить члена команды
        </Button>
       </div>
       <div className="flex flex-col gap-2 w-1/2">
        {participant.map((elem, index2) => (
         <Input
          key={index2}
          className="w-full"
          placeholder={`Имя в матче`}
          value={elem.wrestlerCurName}
          setValue={(newValue) => {
           setParticipants((prevItems) => {
            const newItems = [...prevItems];
            newItems[index][index2] = {
             ...newItems[index][index2],
             wrestlerCurName: newValue,
            };
            return newItems;
           });
          }}
         />
        ))}
       </div>
      </div>
     ))}
     <Button
      variant={"subtle"}
      className="w-full"
      onClick={() =>
       setParticipants((prev) => [
        ...prev,
        [
         {
          wrestlerName: "",
          wrestlerId: "",
          wrestlerImage: "",
          wrestlerCurName: "",
         },
        ],
       ])
      }
     >
      + Добавить участника
     </Button>
    </div>
   </div>
   {participants.some((innerArray) =>
    innerArray.some((obj) => obj.teamId !== undefined)
   ) && (
    <div className="w-full flex flex-col gap-7">
     <Label size="medium" className="font-bold text-start">
      Название команд:
     </Label>
     {teamNames.map((tN, index) => (
      <div key={index} className="flex flex-col gap-3">
       <Dropdown
        array={teams.map((s) => s.name || "")}
        value={tN.name}
        setValue={(newVal) =>
         setTeamNames((prev) => {
          const p = [...prev];
          p[index].name = newVal;
          return p;
         })
        }
        placeholder="Выберите команду"
       />
       <div className="grid grid-cols-3 gap-5 w-full items-center">
        {tN.wrestlers.map((w, index2) => (
         <Dropdown
          key={index2}
          array={participants.flatMap((innerArray) =>
           innerArray.map((participant) => participant.wrestlerName)
          )}
          value={w}
          setValue={(newVal) =>
           setTeamNames((prev) => {
            const p = [...prev];
            p[index].wrestlers[index2] = newVal;
            return p;
           })
          }
          placeholder="Рестлер"
         />
        ))}
        <Button
         variant={"subtle"}
         className="w-full"
         onClick={() =>
          setTeamNames((prev) => {
           const p = [...prev];
           p[index].wrestlers.push("");
           return p;
          })
         }
        >
         + Добавить рестлера
        </Button>
       </div>
      </div>
     ))}
     <Button
      variant={"subtle"}
      className="w-full"
      onClick={() =>
       setTeamNames((prev) => [
        ...prev,
        {
         name: "",
         wrestlers: ["", ""],
        },
       ])
      }
     >
      + Добавить название
     </Button>
    </div>
   )}
   <div className="w-full flex flex-col gap-5">
    <Label size="medium" className="font-bold text-start">
     Если матч уже прошел:
    </Label>
    <InfoLabel>
     Несколько победителей могут быть в чем-то типа баттл-роялов. Если ничья -
     указывать ничья.
    </InfoLabel>
    <div className="grid grid-cols-3 gap-5 w-full items-center">
     <Input placeholder="Время матча mm:ss" value={time} setValue={setTime} />
     <Dropdown
      array={[
       "удержанием",
       "болевым",
       "после ДК",
       "после отсчета",
       "по решению рефери",
      ]}
      value={ending}
      setValue={setEnding}
      placeholder={`Вид завершения`}
     />
     {winner.map((win, index) => (
      <Dropdown
       key={index}
       array={[...participants.map((p) => p[0].wrestlerCurName), "Ничья"]}
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
