"use client";
import { useState } from "react";
import Label from "../ui/Label";
import Input from "../ui/Input";
import { Button } from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { CreateShowPayload } from "@/lib/validators/show";
import { Upload } from "lucide-react";
import Image from "next/image";
import supabase from "@/lib/supabase-browser";

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
 const [imgUrl, setImgUrl] = useState<string | null>(show?.show_img || null);
 const [isError, setIsError] = useState<boolean>(false);

 const router = useRouter();

 const uploadPoster = async (event: React.ChangeEvent<HTMLInputElement>) => {
  try {
   if (!event.target.files || event.target.files.length === 0) {
    throw new Error("You must select an image to upload.");
   }

   const file = event.target.files[0];
   const filePath = `posters/${file.name}`;

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
    show_img: imgUrl || undefined,
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

 const { mutate: updateShow, isLoading: isLoadingUpdate } = useMutation({
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
    show_img: imgUrl || undefined,
   };
   const { data } = await axios.put(`/api/show?id=${show!.id}`, payload);
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
    description: "Could not update the show",
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
      onChange={uploadPoster}
     />
    </div>
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
     <Input
      placeholder="Дата загрузки записи"
      type="date"
      value={date}
      setValue={setDate}
     />
    </div>
   </div>
   <Button
    isLoading={isLoading || isLoadingUpdate}
    onClick={() => {
     setIsError(true);
     show ? updateShow() : createShow();
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
