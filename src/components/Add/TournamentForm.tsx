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
import { parseSide } from "@/lib/utils";

const TournamentForm = ({ tournament }: { tournament?: any }) => {
 const [name, setName] = useState<string>(tournament?.name || "");
 const [description, setDescription] = useState<string>(
  tournament?.description || ""
 );

 const [dateStart, setDateStart] = useState<string>(tournament?.start || "");
 const [dateEnd, setDateEnd] = useState<string>(tournament?.end || "");
 const [type, setType] = useState<string>(tournament?.type || "");
 const [playOff, setPlayOff] = useState<
  {
   wrestlerName: string;
   wrestlerCurName: string;
   wrestlerId: string;
   wrestlerImage: string;
   teamName?: string;
   teamId?: string;
  }[][]
 >(() => {
  if (
   tournament &&
   tournament.play_off_participants &&
   tournament.play_off_participants.length === 32
  ) {
   return tournament.play_off_participants;
  } else {
   return Array.from({ length: 32 }, () => [
    {
     wrestlerId: "",
     wrestlerName: "",
     wrestlerImage: "",
     wrestlerCurName: "",
    },
   ]);
  }
 });
 console.log(playOff);
 const [winner, setWinner] = useState<
  {
   wrestlerName: string;
   wrestlerCurName: string;
   wrestlerId: string;
   wrestlerImage: string;
   teamName?: string;
   teamId?: string;
  }[][]
 >([]);
 const [blocks, setBlocks] = useState<string[] | undefined>(undefined);
 const [isError, setIsError] = useState<boolean>(false);
 const [teamNames, setTeamNames] = useState<
  { name: string; id: string; wrestlers: string[] }[]
 >([]);
 const [wrestlers, setWrestlers] = useState<
  Database["public"]["Tables"]["wrestlers"]["Row"][]
 >([]);
 const [teams, setTeams] = useState<
  Database["public"]["Tables"]["teams"]["Row"][]
 >([]);
 const [number, setNumber] = useState<string>("");

 useEffect(() => {
  const fetchData = async () => {
   const { data: wrestlers } = await supabase.from("wrestlers").select();
   setWrestlers(wrestlers || []);
   const { data: teams } = await supabase.from("teams").select();
   setTeams(teams || []);
  };
  fetchData();
 }, []);

 const router = useRouter();

 const { mutate: createTournament, isLoading } = useMutation({
  mutationFn: async () => {
   const payload: CreateTournamentPayload = {
    name,
    description,
    start: dateStart,
    end: dateEnd,
    play_off_participants: [
     ...playOff
      .map((side) =>
       side.map((participant) => {
        if (participant.teamId === "") {
         const { teamId, teamName, ...rest } = participant;
         return rest;
        }
        return participant;
       })
      )
      .slice(0, parseFloat(number)),
    ],
    block_participants: blocks,
    type,
    winner,
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

 useEffect(() => {
  const updatedParticipants = playOff.map((innerArray) =>
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

  setPlayOff(updatedParticipants);
 }, [teamNames]);

 const handleAddTeammate = (index: number) => {
  const firstParticipant = playOff[index][0];
  const updatedFirstParticipant = {
   ...firstParticipant,
   teamName: firstParticipant.teamName || "",
   teamId: firstParticipant.teamName || "",
  };

  const updatedParticipants = [...playOff];
  updatedParticipants[index] = [
   updatedFirstParticipant,
   ...playOff[index].slice(1),
  ];
  updatedParticipants[index].push({
   wrestlerName: "",
   wrestlerId: "",
   wrestlerImage: "",
   wrestlerCurName: "",
   teamName: "",
   teamId: "",
  });
  setPlayOff(updatedParticipants);
 };

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
        {playOff.slice(0, parseFloat(number)).map((participant, index) => (
         <div key={index} className="flex w-full items-start gap-10">
          <div className="flex flex-col gap-2 w-full">
           {participant.map((elem, index2) => (
            <div key={index2} className="flex gap-3 w-full items-center">
             <div className="flex-1">
              <Dropdown
               array={wrestlers.map((w) => w.name || "")}
               placeholder={`Рестлер ${index2 + 1}`}
               value={elem.wrestlerName}
               setValue={(newValue) => {
                if (newValue === "") return;
                setPlayOff((prevItems) => {
                 const updatedParticipants = [...prevItems];
                 updatedParticipants[index][index2].wrestlerName = newValue;
                 updatedParticipants[index][index2].wrestlerId = wrestlers
                  .find((wr) => wr.name === newValue)!
                  .id.toString();
                 updatedParticipants[index][index2].wrestlerImage =
                  wrestlers.find((wr) => wr.name === newValue)!.wrestler_img!;
                 return updatedParticipants;
                });
               }}
              />
             </div>
             <Input
              key={index2}
              className="w-1/2"
              placeholder={`Имя в матче`}
              value={elem.wrestlerCurName}
              setValue={(newValue) => {
               setPlayOff((prevItems) => {
                const newItems = [...prevItems];
                newItems[index][index2] = {
                 ...newItems[index][index2],
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
            onClick={() => handleAddTeammate(index)}
           >
            + Добавить члена команды
           </Button>
          </div>
         </div>
        ))}

        {playOff.some((innerArray) =>
         innerArray.some((obj) => obj.teamId !== undefined)
        ) && (
         <div className="w-full flex flex-col gap-7">
          <Label size="medium" className="font-bold text-start">
           Название команд:
          </Label>
          <InfoLabel>
           Нужно если в турнире участвуют официальные команды/группировки.
          </InfoLabel>
          {teamNames.map((tN, index) => (
           <div key={index} className="flex flex-col gap-3">
            <Dropdown
             array={[...teams.map((s) => s.name || ""), "Nfr{b"]}
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
               array={playOff.flatMap((innerArray) =>
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

        <TournamentBracket
         participants={parseFloat(number)}
         items={playOff.slice(0, parseFloat(number))}
        />
       </>
      )}
     </div>
    </div>
   )}
   {type !== "" && (
    <div className="w-full flex flex-col gap-5">
     <Label size="medium" className="font-bold text-start">
      Если турнир уже прошел:
     </Label>

     <div className="grid grid-cols-3 gap-5 w-full items-center">
      {winner.map((win, index) => (
       <Dropdown
        key={index}
        array={[
         ...playOff.map((side) => parseSide(side)).slice(0, parseFloat(number)),
         "Ничья",
        ]}
        value={win !== undefined ? parseSide(win) : "Ничья"}
        setValue={(newValue) => {
         if (newValue === "Ничья") setWinner([]);
         setWinner((prev) => {
          const newArray = [...prev];
          newArray[index] =
           playOff[
            [...playOff.map((side) => parseSide(side))].indexOf(newValue)
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
