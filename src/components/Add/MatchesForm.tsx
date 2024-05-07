"use client";
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase-browser";
import { parseSide } from "@/lib/utils";
import { CreateMatchPayload } from "@/lib/validators/match";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import Dropdown from "../ui/Dropdown";
import InfoLabel from "../ui/InfoLabel";
import Input from "../ui/Input";
import Label from "../ui/Label";

const MatchForm = ({ match }: { match?: any }) => {
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

 const [type, setType] = useState<string>(match?.type || "");
 const [title, setTitle] = useState<string[]>(
  match?.challanges.map((ch: any) => ch.title_name) || []
 );
 const [order, setOrder] = useState<string>(match?.order.toString() || "");
 const [time, setTime] = useState<string>(match?.time || "");
 const [show, setShow] = useState<string>(match?.show || "");
 const [tournament, setTournament] = useState<string>(match?.tournament || "");
 const [participants, setParticipants] = useState<
  {
   wrestlerName: string;
   wrestlerCurName: string;
   wrestlerId: string;
   wrestlerImage: string;
   teamName?: string;
   teamId?: string;
  }[][]
 >(match?.match_sides.map((s: any) => s.wrestlers) || []);
 const [ending, setEnding] = useState<string>(match?.ending || "");
 const [winner, setWinner] = useState<
  {
   wrestlerName: string;
   wrestlerCurName: string;
   wrestlerId: string;
   wrestlerImage: string;
   teamName?: string;
   teamId?: string;
  }[][]
 >(match?.winners.map((s: any) => s.winner) || []);
 const [teamNames, setTeamNames] = useState<
  { name: string; id: string; wrestlers: string[] }[]
 >([]);

 const [isError, setIsError] = useState<boolean>(false);

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

 useEffect(() => {
  const updatedParticipants = participants.map((innerArray) =>
   innerArray.map((participant) => {
    if (participant.wrestlerCurName === "")
     return {
      ...participant,
     };
    const team = teamNames.find((team) =>
     team.wrestlers.includes(participant.wrestlerCurName)
    );
    return {
     ...participant,
     teamName: team?.name || participant.teamName,
     teamId: team?.id || participant.teamId,
    };
   })
  );

  setParticipants(updatedParticipants);
 }, [teamNames]);

 const handleAddTeammate = (index: number) => {
  const firstParticipant = participants[index][0];
  const updatedFirstParticipant = {
   ...firstParticipant,
   teamName: firstParticipant.teamName || "",
   teamId: firstParticipant.teamId || "",
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
 const { mutate: creatematch, isLoading } = useMutation({
  mutationFn: async () => {
   const payload: CreateMatchPayload = {
    participants: participants.map((side) =>
     side
      .filter(
       (participant) =>
        participant.wrestlerId !== "" && participant.wrestlerCurName !== ""
      )
      .map((participant) => {
       if (participant.teamId === "") {
        const { teamId, teamName, ...rest } = participant;
        return rest;
       }
       return participant;
      })
    ),
    ending: ending === "" ? undefined : ending,
    type: type === "" ? undefined : type,
    time: time === "" ? undefined : time,
    show: shows!.find((s) => s.name === show)?.id || 0,
    tournament: tournaments!.find((s) => s.name === tournament)?.id,
    winner: winner.includes(undefined!)
     ? undefined
     : winner.map((side) =>
        side
         .filter(
          (participant) =>
           participant.wrestlerId !== "" && participant.wrestlerCurName !== ""
         )
         .map((participant) => {
          if (participant.teamId === "") {
           const { teamId, teamName, ...rest } = participant;
           return rest;
          }
          return participant;
         })
       ),
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
    participants: participants.map((side) =>
     side
      .filter(
       (participant) =>
        participant.wrestlerId !== "" && participant.wrestlerCurName !== ""
      )
      .map((participant) => {
       if (participant.teamId === "") {
        const { teamId, teamName, ...rest } = participant;
        return rest;
       }
       return participant;
      })
    ),
    ending: ending === "" ? undefined : ending,
    type: type === "" ? undefined : type,
    time: time === "" ? undefined : time,
    show: shows!.find((s) => s.name === show)?.id || 0,
    tournament: tournaments!.find((s) => s.name === tournament)?.id,
    winner: winner.includes(undefined!)
     ? undefined
     : winner.map((side) =>
        side
         .filter(
          (participant) =>
           participant.wrestlerId !== "" && participant.wrestlerCurName !== ""
         )
         .map((participant) => {
          if (participant.teamId === "") {
           const { teamId, teamName, ...rest } = participant;
           return rest;
          }
          return participant;
         })
       ),
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
     array={shows
      .sort(
       (a, b) =>
        new Date(b.upload_date || new Date()).getTime() -
        new Date(a.upload_date || new Date()).getTime()
      )
      .map((s) => s.name || "")}
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
      key={`title_${index}`}
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
    <InfoLabel>Записывайте рестлера и его имя в конкретном матче.</InfoLabel>
    <div className="flex gap-3 flex-col mt-3">
     {participants.map((participant, index1) => (
      <div key={`side_${index1}`} className="flex w-full items-start gap-10">
       <div className="flex flex-col gap-2 w-full">
        {participant.map((_, index2) => (
         <div
          key={`participant_${index2}`}
          className="flex gap-3 w-full items-center"
         >
          <div className="flex-1">
           <Dropdown
            key={`dropdown_${index1}_${index2}`}
            disabled={winner.length !== 0}
            array={wrestlers!
             .sort((a, b) => a.name.localeCompare(b.name))
             .map((w) => w.name || "")}
            placeholder={`Рестлер ${index2 + 1}`}
            value={participants[index1][index2].wrestlerName}
            setValue={(newValue) => {
             if (newValue === "") return;
             setParticipants((prevItems) => {
              const updatedParticipants = [...prevItems];
              updatedParticipants[index1][index2].wrestlerName = newValue;
              updatedParticipants[index1][index2].wrestlerCurName = newValue;
              updatedParticipants[index1][index2].wrestlerId = wrestlers
               .find((wr) => wr.name === newValue)!
               .id.toString();
              updatedParticipants[index1][index2].wrestlerImage =
               wrestlers.find((wr) => wr.name === newValue)!.wrestler_img!;
              return updatedParticipants;
             });
            }}
           />
          </div>
          <Input
           key={`input_${index1}_${index2}`}
           disabled={winner.length !== 0}
           className="w-1/2"
           placeholder={`Имя в матче`}
           value={participants[index1][index2].wrestlerCurName}
           setValue={(newValue) => {
            setParticipants((prevItems) => {
             const newItems = [...prevItems];
             newItems[index1][index2] = {
              ...newItems[index1][index2],
              wrestlerCurName: newValue,
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
         onClick={() => handleAddTeammate(index1)}
        >
         + Добавить члена команды
        </Button>
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
     <InfoLabel>
      Нужно если в матче участвуют официальные команды/группировки.
     </InfoLabel>
     {teamNames.map((tN, index) => (
      <div key={`tN_${index}`} className="flex flex-col gap-3">
       <Dropdown
        array={[...teams.map((s) => s.name || "")]}
        value={tN.name}
        setValue={(newVal) =>
         setTeamNames((prev) => {
          const p = [...prev];
          p[index].name = newVal;
          p[index].id = teams.find((t) => t.name === newVal)!.id.toString();
          return p;
         })
        }
        placeholder="Выберите команду"
       />
       <div className="grid grid-cols-3 gap-5 w-full items-center">
        {tN.wrestlers.map((w, index2) => (
         <Dropdown
          key={`teamWrestler_${index}`}
          array={participants.flatMap((innerArray) =>
           innerArray
            .map((participant) => participant.wrestlerCurName)
            .filter(
             (wrestler) =>
              !teamNames.some((team) => team.wrestlers.includes(wrestler))
            )
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
         id: "",
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
       "по лимиту времени",
      ]}
      value={ending}
      setValue={setEnding}
      placeholder={`Вид завершения`}
     />
     {winner.map((win, index) => (
      <Dropdown
       key={`win_${index}`}
       array={[...participants.map((p) => parseSide(p)), "Ничья"]}
       value={win !== undefined ? parseSide(win) : "Ничья"}
       setValue={(newValue) => {
        if (newValue === "Ничья") setWinner([]);
        setWinner((prev) => {
         const newArray = [...prev];
         newArray[index] =
          participants[
           [...participants.map((side) => parseSide(side))].indexOf(newValue)
          ];
         return newArray;
        });
       }}
       placeholder={`Победитель ${index + 1}`}
      />
     ))}
     <Button
      variant={"subtle"}
      className="w-full"
      onClick={() => setWinner((prev) => [...prev, []])}
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
