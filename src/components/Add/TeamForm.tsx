"use client";
import { useEffect, useState } from "react";
import Dropdown from "@/components/ui/Dropdown";
import Label from "../ui/Label";
import Input from "../ui/Input";
import { Button } from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase-browser";
import { CreateTeamPayload } from "@/lib/validators/team";

const TeamForm = ({
 team,
 team_current_participants,
 team_former_participants,
}: {
 team?: Database["public"]["Tables"]["teams"]["Row"];
 team_current_participants?: Database["public"]["Tables"]["teams_current_participants"]["Row"][];
 team_former_participants?: Database["public"]["Tables"]["teams_former_participants"]["Row"][];
}) => {
 const [name, setName] = useState<string>(team?.name || "");
 const [creationDate, setCreationDate] = useState<string>(
  team?.creation_date || ""
 );
 const [disbandDate, setDisbandDate] = useState<string>(
  team?.disband_date || ""
 );
 const [current_participants, setCurrentParticipants] = useState<
  { wrestlerId: string; wrestlerName: string; wrestlerCurName: string }[]
 >(
  team_current_participants?.map((p) => ({
   wrestlerId: p.wrestler_id.toString(),
   wrestlerName: p.wrestler_name,
   wrestlerCurName: p.wrestler_name,
  })) || [{ wrestlerId: "", wrestlerName: "", wrestlerCurName: "" }]
 );
 const [former_participants, setFormerParticipants] = useState<
  { wrestlerId: string; wrestlerName: string; wrestlerCurName: string }[]
 >(
  team_former_participants?.map((p) => ({
   wrestlerId: p.wrestler_id.toString(),
   wrestlerName: p.wrestler_name,
   wrestlerCurName: p.wrestler_name,
  })) || []
 );
 const [leader, setLeader] = useState<string>(
  team_current_participants?.find((p) => p.isLeader === true)?.wrestler_name ||
   ""
 );
 const [reigns, setReigns] = useState<
  {
   wrestlerName: string;
   wrestlerId: number;
   titleName: string;
   titleCurName: string;
   titleId: number;
   start: string;
   end: string;
  }[][]
 >([]);
 const [isError, setIsError] = useState<boolean>(false);
 const [wrestlers, setWrestlers] = useState<
  Database["public"]["Tables"]["wrestlers"]["Row"][]
 >([]);
 const [titles, setTitles] = useState<
  Database["public"]["Tables"]["titles"]["Row"][]
 >([]);

 const router = useRouter();

 useEffect(() => {
  const fetchData = async () => {
   const { data: wrestlers } = await supabase.from("wrestlers").select();
   setWrestlers(wrestlers || []);
   const { data: titles } = await supabase.from("titles").select();
   setTitles(titles || []);
  };
  fetchData();
 }, []);

 const { mutate: createTeam, isLoading } = useMutation({
  mutationFn: async () => {
   const payload: CreateTeamPayload = {
    name,
    creation_date: creationDate,
    disband_date: disbandDate === "" ? undefined : disbandDate,
    current_participants,
    former_participants,
    leader,
    reigns: reigns
     .filter((reign) => reign.some((champion) => champion.titleId !== 0))
     .map((reign) =>
      reign.filter(
       (champion) => champion.wrestlerId !== 0 || champion.titleId !== 0
      )
     ),
   };
   const { data } = await axios.post("/api/team", payload);
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
    description: "Could not create the wrestler",
    variant: "destructive",
   });
  },
  onSuccess: (data) => {
   router.push(`/team/${data}`);
   router.refresh();
  },
 });

 const { mutate: updateTeam, isLoading: isLoadingUpdate } = useMutation({
  mutationFn: async () => {
   const payload: CreateTeamPayload = {
    name,
    creation_date: creationDate,
    disband_date: disbandDate === "" ? undefined : disbandDate,
    current_participants,
    former_participants,
    leader,
    reigns: reigns
     .filter((reign) => reign.some((champion) => champion.titleId !== 0))
     .map((reign) =>
      reign.filter(
       (champion) => champion.wrestlerId !== 0 || champion.titleId !== 0
      )
     ),
   };
   const { data } = await axios.put(`/api/team?id=${team!.id}`, payload);
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
    description: "Could not update the wrestler",
    variant: "destructive",
   });
  },
  onSuccess: (data) => {
   router.push(`/team/${data}`);
   router.refresh();
  },
 });

 return (
  <div className="flex flex-col items-center gap-10 w-full">
   <Label className="font-bold">
    {team ? "Editing team..." : "Creating new team..."}
   </Label>
   <div className="w-full">
    <div className="grid grid-cols-3 gap-5">
     <Input
      placeholder="Team/group name"
      value={name}
      setValue={setName}
      isError={isError && name === ""}
     />
     <Input
      placeholder="Date of creation"
      value={creationDate}
      setValue={setCreationDate}
      type="date"
      isError={isError && creationDate === ""}
     />
     <Input
      placeholder="Date of disband"
      value={disbandDate}
      setValue={setDisbandDate}
      type="date"
     />
    </div>
   </div>
   <div className="w-full flex flex-col gap-5">
    <Label size="medium" className="font-bold text-start mb-5">
     Действующие участники:
    </Label>

    <div className="flex flex-col gap-3 items-center">
     {current_participants.map((p, index) => (
      <div key={index} className="flex gap-3 w-full items-center">
       <div className="flex-1">
        <Dropdown
         array={wrestlers
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((w) => w.name || "")}
         placeholder={`Рестлер ${index + 1}`}
         value={p.wrestlerName}
         setValue={(newValue) => {
          if (newValue === "") return;
          setCurrentParticipants((prevItems) => {
           const updatedParticipants = [...prevItems];
           updatedParticipants[index].wrestlerName = newValue;
           updatedParticipants[index].wrestlerCurName = newValue;
           updatedParticipants[index].wrestlerId = wrestlers
            .find((wr) => wr.name === newValue)!
            .id.toString();

           return updatedParticipants;
          });
         }}
        />
       </div>
       <Input
        className="w-1/2"
        placeholder={`Имя в турнире`}
        value={p.wrestlerCurName}
        setValue={(newValue) => {
         setCurrentParticipants((prevItems) => {
          const newItems = [...prevItems];
          newItems[index] = {
           ...newItems[index],
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
      onClick={() =>
       setCurrentParticipants((prev) => [
        ...prev,
        {
         wrestlerName: "",
         wrestlerId: "",
         wrestlerCurName: "",
        },
       ])
      }
     >
      + Добавить участника
     </Button>
    </div>

    <div className="w-full">
     <Label size="medium" className="font-bold text-start mb-5">
      Прошлые участники:
     </Label>

     <div className="flex flex-col gap-3 items-center">
      {former_participants.map((p, index) => (
       <div key={index} className="flex gap-3 w-full items-center">
        <div className="flex-1">
         <Dropdown
          array={wrestlers
           .sort((a, b) => a.name.localeCompare(b.name))
           .map((w) => w.name || "")}
          placeholder={`Рестлер ${index + 1}`}
          value={p.wrestlerName}
          setValue={(newValue) => {
           if (newValue === "") return;
           setFormerParticipants((prevItems) => {
            const updatedParticipants = [...prevItems];
            updatedParticipants[index].wrestlerName = newValue;
            updatedParticipants[index].wrestlerCurName = newValue;
            updatedParticipants[index].wrestlerId = wrestlers
             .find((wr) => wr.name === newValue)!
             .id.toString();

            return updatedParticipants;
           });
          }}
         />
        </div>
        <Input
         className="w-1/2"
         placeholder={`Имя в турнире`}
         value={p.wrestlerCurName}
         setValue={(newValue) => {
          setFormerParticipants((prevItems) => {
           const newItems = [...prevItems];
           newItems[index] = {
            ...newItems[index],
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
       onClick={() =>
        setFormerParticipants((prev) => [
         ...prev,
         {
          wrestlerName: "",
          wrestlerId: "",
          wrestlerCurName: "",
         },
        ])
       }
      >
       + Добавить участника
      </Button>
     </div>
    </div>
    <Label size="medium" className="font-bold text-start">
     Лидер:
    </Label>
    <Dropdown
     placeholder="Выбрать лидера"
     array={current_participants.map((cp) => cp.wrestlerCurName)}
     value={leader}
     setValue={setLeader}
    />

    <div className="w-full flex flex-col gap-7">
     <Label size="medium" className="font-bold text-start">
      Титульные рейны:
     </Label>
     {reigns.map((reign, index) => (
      <div key={index} className="grid grid-cols-3 gap-5 items-center">
       <Dropdown
        placeholder="Выберите титул"
        array={[...titles]
         .filter((title) => title.type !== "Одиночный титул")
         .map((title) => title.name)}
        value={reign[0].titleName}
        setValue={(newVal) =>
         setReigns((prev) => {
          const newReigns = [...prev];
          for (let newReign of newReigns[index]) {
           newReign.titleName = newVal;
           newReign.titleId = titles.find((t) => (t.name = newVal))!.id;
           newReign.titleCurName = newVal;
          }

          return newReigns;
         })
        }
       />
       <Input
        placeholder="Название титула в рейне"
        value={reign[0].titleCurName}
        setValue={(newVal) =>
         setReigns((prev) => {
          const newReigns = [...prev];
          for (let newReign of newReigns[index]) {
           newReign.titleCurName = newVal;
          }
          return newReigns;
         })
        }
       />
       <Input
        placeholder="Начало"
        type="date"
        value={reign[0].start}
        setValue={(newVal) =>
         setReigns((prev) => {
          const newReigns = [...prev];
          for (let newReign of newReigns[index]) {
           newReign.start = newVal;
          }
          return newReigns;
         })
        }
       />
       <Input
        placeholder="Конец"
        type="date"
        value={reign[0].end}
        setValue={(newVal) =>
         setReigns((prev) => {
          const newReigns = [...prev];
          for (let newReign of newReigns[index]) {
           newReign.end = newVal;
          }
          return newReigns;
         })
        }
       />
       {reign.map((participant, index2) => (
        <Dropdown
         key={index2}
         placeholder={`Чемпион ${index2 + 1}`}
         array={current_participants.map((p) => p.wrestlerCurName)}
         value={participant.wrestlerName}
         setValue={(newVal) =>
          setReigns((prev) => {
           const newReigns = [...prev];
           newReigns[index][index2].wrestlerName = newVal;
           newReigns[index][index2].wrestlerId = parseFloat(
            current_participants.find((p) => p.wrestlerCurName === newVal)!
             .wrestlerId
           );
           return newReigns;
          })
         }
        />
       ))}
       <Button
        variant={"subtle"}
        className="w-full"
        onClick={() =>
         setReigns((prev) => {
          const p = [...prev];
          p[index].push({
           titleId: 0,
           titleName: "",
           titleCurName: "",
           wrestlerId: 0,
           wrestlerName: "",
           start: "",
           end: "",
          });
          return p;
         })
        }
       >
        + Добавить чемпиона
       </Button>
      </div>
     ))}

     <Button
      variant={"subtle"}
      className="w-full"
      onClick={() =>
       setReigns((prev) => {
        const p = [...prev];
        p.push([
         {
          titleId: 0,
          titleName: "",
          titleCurName: "",
          wrestlerId: 0,
          wrestlerName: "",
          start: "",
          end: "",
         },
        ]);
        return p;
       })
      }
     >
      + Добавить рейн
     </Button>
    </div>
   </div>
   <Button
    isLoading={isLoading || isLoadingUpdate}
    onClick={() => {
     setIsError(true);
     team ? updateTeam() : createTeam();
    }}
    size="lg"
    className="w-1/2"
   >
    {team ? "Update" : "Create"}
   </Button>
  </div>
 );
};

export default TeamForm;
