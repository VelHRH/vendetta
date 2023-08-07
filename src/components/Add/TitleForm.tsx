"use client";

import { toast } from "@/hooks/use-toast";
import { CreateTitlePayload } from "@/lib/validators/title";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/Button";
import Dropdown from "../ui/Dropdown";
import Input from "../ui/Input";
import Label from "../ui/Label";

const TitleForm = ({
 title,
}: {
 title?: Database["public"]["Tables"]["titles"]["Row"];
}) => {
 const [name, setName] = useState<string>(title?.name || "");
 const [type, setType] = useState<string>(title?.type || "");
 const [promotion, setPromotion] = useState<string>(title?.promotion || "");
 const [isActive, setisActive] = useState<string>(
  title ? (title.isActive ? "Да" : "Нет") : ""
 );
 const [startDate, setStartDate] = useState<string>(title?.start || "");
 const [endDate, setEndDate] = useState<string>(title?.end || "");
 const [isError, setIsError] = useState<boolean>(false);

 const router = useRouter();

 const { mutate: createTitle, isLoading } = useMutation({
  mutationFn: async () => {
   const payload: CreateTitlePayload = {
    name,
    type,
    promotion: promotion === "" ? undefined : promotion,
    isActive: isActive === "Нет" ? false : true,
    start: startDate,
    end: endDate === "" ? undefined : endDate,
   };
   const { data } = await axios.post("/api/title", payload);
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
    description: "Could not create the title",
    variant: "destructive",
   });
  },
  onSuccess: (data) => {
   router.push(`/title/${data}`);
   router.refresh();
  },
 });

 const { mutate: updateTitle, isLoading: isLoadingUpdate } = useMutation({
  mutationFn: async () => {
   const payload: CreateTitlePayload = {
    name,
    type,
    promotion,
    isActive: isActive === "Нет" ? false : true,
    start: startDate,
    end: endDate === "" ? undefined : endDate,
   };
   const { data } = await axios.put(`/api/title?id=${title!.id}`, payload);
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
    description: "Could not update the title",
    variant: "destructive",
   });
  },
  onSuccess: (data) => {
   router.push(`/title/${data}`);
   router.refresh();
  },
 });

 return (
  <div className="flex flex-col items-center gap-10 w-full">
   <Label className="font-bold">
    {title ? "Редактирование титула..." : "Создание нового титула..."}
   </Label>
   <div className="grid grid-cols-3 gap-5 w-full">
    <Input
     placeholder="Название титула"
     value={name}
     setValue={setName}
     isError={isError && name.length === 0}
    />

    <Dropdown
     array={["Одиночный титул", "Командный титул", "Триос титул"]}
     value={type}
     setValue={setType}
     placeholder="Тип титула"
     isError={isError && type.length === 0}
    />
    <Input
     placeholder="Промоушен (Vendetta по умолчанию)"
     value={promotion}
     setValue={setPromotion}
    />
    <Dropdown
     array={["Да", "Нет"]}
     value={isActive}
     setValue={setisActive}
     placeholder="Активный титул?"
    />
    <Input
     placeholder="Дата создания"
     type="date"
     value={startDate}
     setValue={setStartDate}
     isError={isError && startDate.length === 0}
    />
    <Input
     placeholder="Дата деактивации"
     type="date"
     value={endDate}
     setValue={setEndDate}
    />
   </div>

   <Button
    isLoading={isLoading || isLoadingUpdate}
    onClick={() => {
     setIsError(true);
     title ? updateTitle() : createTitle();
    }}
    size="lg"
    className="w-1/2"
   >
    {title ? "Update" : "Create"}
   </Button>
  </div>
 );
};

export default TitleForm;
