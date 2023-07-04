"use client";
import { useState } from "react";
import Label from "../ui/Label";
import Input from "../ui/Input";
import { Button } from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import { CreateWrestlerPayload } from "@/lib/validators/wrestler";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { CreateShowPayload } from "@/lib/validators/show";

const ShowForm = ({
 show,
}: {
 show?: Database["public"]["Tables"]["shows"]["Row"];
}) => {
 const [name, setName] = useState<string>(show?.name || "");
 const [date, setDate] = useState<string>(show?.upload_date || "");
 const [promotions, setPromotions] = useState<string>(
  show?.promotion?.join(", ") || ""
 );
 const [showType, setShowType] = useState<string>(show?.type || "");
 const [location, setLocation] = useState<string>(show?.location || "");
 const [arena, setArena] = useState<string>(show?.arena || "");
 const [attendance, setAttendance] = useState<string>(
  show?.attendance?.toString() || ""
 );
 const [isError, setIsError] = useState<boolean>(false);

 const router = useRouter();

 const { mutate: createShow, isLoading } = useMutation({
  mutationFn: async () => {
   const payload: CreateShowPayload = {
    name,
    date,
    promotions:
     promotions.split(",").filter((p) => p.trim()).length === 0
      ? ["Vendetta Federation"]
      : promotions.split(",").filter((p) => p.trim()),
    showType,
    location,
    arena,
    attendance: parseFloat(attendance) || undefined,
   };
   const { data } = await axios.post("/api/show", payload);
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
    description: "Could not create the show",
    variant: "destructive",
   });
  },
  onSuccess: (data) => {
   router.push(`/show/${data}`);
   router.refresh();
  },
 });

 return (
  <div className="flex flex-col items-center gap-10 w-full">
   <Label className="font-bold">
    {show ? "Редактирование шоу..." : "Создание нового шоу..."}
   </Label>
   <div className="grid grid-cols-3 gap-5 w-full">
    <Input
     placeholder="Название шоу"
     value={name}
     setValue={setName}
     isError={isError && name.length === 0}
    />
    <Input
     placeholder="Дата загрузки записи"
     type="date"
     value={date}
     setValue={setDate}
     isError={isError && date.length === 0}
    />
    <Input placeholder="Тип шоу" value={showType} setValue={setShowType} />
    <Input
     placeholder="Промоушен (Vendetta Federation по умолчанию)"
     value={promotions}
     setValue={setPromotions}
    />
    <Input
     placeholder="Город проведения"
     value={location}
     setValue={setLocation}
    />
    <Input placeholder="Арена" value={arena} setValue={setArena} />
   </div>
   <div className="w-full">
    <Label size="medium" className="font-bold text-start mb-5">
     Если шоу уже прошло:
    </Label>
    <div className="grid grid-cols-3 gap-5 items-center">
     <Input
      placeholder="Посещаемость"
      value={attendance}
      type="number"
      setValue={setAttendance}
     />
    </div>
   </div>
   <Button
    isLoading={isLoading}
    onClick={() => {
     setIsError(true);
     createShow();
    }}
    size="lg"
    className="w-1/2"
   >
    {show ? "Update" : "Create"}
   </Button>
  </div>
 );
};

export default ShowForm;
