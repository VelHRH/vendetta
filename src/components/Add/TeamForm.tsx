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
import { Upload } from "lucide-react";
import Image from "next/image";

const TeamForm = ({
 team,
 team_current_participants,
 team_former_participants,
 fetchedReigns,
}: {
 team?: Database["public"]["Tables"]["teams"]["Row"];
 team_current_participants?: Database["public"]["Tables"]["teams_current_participants"]["Row"][];
 team_former_participants?: Database["public"]["Tables"]["teams_former_participants"]["Row"][];
 fetchedReigns?: Database["public"]["Tables"]["reigns"]["Row"][];
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
 const [imgUrl, setImgUrl] = useState<string | null>(team?.img_url || null);
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
 >(reignsSetter(fetchedReigns!) || []);
 const [history, setHistory] = useState<string[]>(team?.history || []);
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

 const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
  try {
   if (!event.target.files || event.target.files.length === 0) {
    throw new Error("You must select an image to upload.");
   }

   const file = event.target.files[0];
   const filePath = `teams/${file.name}`;

   let { error: uploadError } = await supabase.storage
    .from("wrestlers")
    .upload(filePath, file, {
     cacheControl: "3600",
     upsert: false,
    });

   if (uploadError) {
    throw uploadError.message;
   }

   setImgUrl(
    `https://brytpkxacsmzbawwiqcr.supabase.co/storage/v1/object/public/wrestlers/${filePath}`
   );
  } catch (error) {
   if (error === "The resource already exists") {
    return toast({
     title: error,
     description: "The image with this name was already uploaded",
     variant: "destructive",
    });
   }
   toast({
    title: "Error while uploading",
    description: "Could not upload",
    variant: "destructive",
   });
  }
 };

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
    img_url: imgUrl !== null ? imgUrl : undefined,
    history: history.length === 0 ? undefined : history,
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
    img_url: imgUrl !== null ? imgUrl : undefined,
    history: history.length === 0 ? undefined : history,
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
     <div className="w-full h-full flex items-center">
      <label
       htmlFor="uploadImg"
       className={`flex w-full h-12 p-2 justify-between items-center cursor-pointer bg-transparent border-[3px] border-slate-500 rounded-md hover:scale-105 duration-300`}
      >
       {imgUrl ? (
        <>
         <div className="h-full aspect-square relative">
          <Image fill alt="Image" src={imgUrl} />
         </div>
         <Upload className={`text-4xl`} />
        </>
       ) : (
        <>
         <div className="text-lg font-semibold">Image</div>
         <Upload className={`text-4xl`} />
        </>
       )}
      </label>
      <input
       className="hidden"
       type="file"
       id="uploadImg"
       accept="image/*"
       onChange={uploadImage}
      />
     </div>
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
           newReign.titleId = titles.find((t) => t.name === newVal)!.id;
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
    <div className="w-full flex flex-col gap-5">
     <Label size="medium" className="font-bold text-start">
      История:
     </Label>
     {history.map((hist, index) => (
      <Input
       key={index}
       placeholder={`Событие ${index + 1}`}
       value={hist}
       setValue={(newVal) =>
        setHistory((prev) => {
         const newHist = [...prev];
         newHist[index] = newVal;
         return newHist;
        })
       }
      />
     ))}
     <Button
      variant={"subtle"}
      className="w-full"
      onClick={() =>
       setHistory((prev) => {
        const p = [...prev];
        p.push("");
        return p;
       })
      }
     >
      + Добавить событие
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

const reignsSetter = (
 reigns: Database["public"]["Tables"]["reigns"]["Row"][]
) => {
 const reignsFiltered = [...reigns].filter(
  (reign, index, self) =>
   index ===
   self.findIndex(
    (r) =>
     r.start === reign.start &&
     r.end === reign.end &&
     r.team_id === reign.team_id
   )
 );
 const newReigns: {
  wrestlerName: string;
  wrestlerId: number;
  titleName: string;
  titleCurName: string;
  titleId: number;
  start: string;
  end: string;
 }[][] = [];
 for (let i in reignsFiltered) {
  newReigns[i] = [];

  for (let similarReign of [...reigns].filter(
   (reign) =>
    reign.team_id === reignsFiltered[i].team_id &&
    reign.team_id === reignsFiltered[i].team_id &&
    reign.start === reignsFiltered[i].start &&
    reign.end === reignsFiltered[i].end
  )) {
   newReigns[i].push({
    wrestlerName: similarReign.wrestler_name,
    wrestlerId: similarReign.wrestler_id,
    titleName: similarReign.title_name,
    titleCurName: similarReign.title_name,
    titleId: similarReign.title_id,
    start: similarReign.start,
    end: similarReign.end || "",
   });
  }
 }
 return newReigns;
};
