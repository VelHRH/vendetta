"use client";
import { useEffect, useState } from "react";
import Dropdown from "@/components/ui/Dropdown";
import Label from "../ui/Label";
import Input from "../ui/Input";
import { Button } from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import { CreateWrestlerPayload } from "@/lib/validators/wrestler";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase-browser";
import { Upload } from "lucide-react";
import Image from "next/image";
const WrestlerForm = ({
 wrestler,
 fetchedReigns,
}: {
 wrestler?: Database["public"]["Tables"]["wrestlers"]["Row"];
 fetchedReigns?: Database["public"]["Tables"]["reigns"]["Row"][];
}) => {
 const [sex, setSex] = useState<string>(wrestler?.sex || "");
 const [realname, setRealname] = useState<string>(wrestler?.real_name || "");
 const [height, setHeight] = useState<string>(
  wrestler?.height?.toString() || ""
 );
 const [weight, setWeight] = useState<string>(
  wrestler?.weight?.toString() || ""
 );
 const [birth, setBirth] = useState<string>(wrestler?.born || "");
 const [city, setCity] = useState<string>(wrestler?.city || "");
 const [country, setCountry] = useState<string>(wrestler?.country || "");
 const [name, setName] = useState<string>(wrestler?.name || "");
 const [styles, setStyles] = useState<string>(
  wrestler?.style?.join(", ") || ""
 );
 const [trainers, setTrainers] = useState<string>(
  wrestler?.trainer?.join(", ") || ""
 );
 const [nicknames, setNicknames] = useState<string>(
  wrestler?.nickname?.join(", ") || ""
 );
 const [moves, setMoves] = useState<string>(wrestler?.moves?.join(", ") || "");
 const [careerstart, setCareerstart] = useState<string>(
  wrestler?.career_start || ""
 );
 const [imgUrl, setImgUrl] = useState<string | null>(
  wrestler?.wrestler_img || null
 );
 const [isVendetta, setIsVendetta] = useState<string>(
  wrestler ? (wrestler.isVendetta ? "Yes" : "No") : ""
 );
 const [reigns, setReigns] = useState<
  {
   wrestlerName: string;
   titleName: string;
   titleCurName: string;
   titleId: number;
   start: string;
   end: string;
  }[]
 >(
  fetchedReigns?.map((r) => ({
   wrestlerName: r.wrestler_name,
   titleName: r.title_name,
   titleCurName: r.title_name,
   titleId: r.title_id,
   start: r.start,
   end: r.end || "",
  })) || []
 );
 const [titles, setTitles] = useState<
  Database["public"]["Tables"]["titles"]["Row"][]
 >([]);
 const [isError, setIsError] = useState<boolean>(false);

 const router = useRouter();

 useEffect(() => {
  const fetchData = async () => {
   const { data: titles } = await supabase.from("titles").select();
   setTitles(titles || []);
  };
  fetchData();
 }, []);

 const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
  try {
   if (!event.target.files || event.target.files.length === 0) {
    throw new Error("You must select an image to upload.");
   }

   const file = event.target.files[0];
   const filePath = `1nuyyf9_0/${file.name}`;

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

 const { mutate: createWrestler, isLoading } = useMutation({
  mutationFn: async () => {
   const payload: CreateWrestlerPayload = {
    name,
    realname,
    sex,
    city,
    country,
    nicknames: nicknames.split(",").filter((nickname) => nickname.trim()),
    height: parseFloat(height),
    weight: parseFloat(weight),
    styles: styles.split(",").filter((style) => style.trim()),
    trainers: trainers.split(",").filter((trainer) => trainer.trim()),
    birth: birth === "" ? undefined : birth,
    careerstart: careerstart === "" ? undefined : careerstart,
    isVendetta: isVendetta !== "No",
    wrestler_img: imgUrl || undefined,
    moves: moves.replace(/\s/g, "").split(","),
    reigns: reigns.filter((reign) => reign.titleId !== 0),
   };
   const { data } = await axios.post("/api/wrestler", payload);
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
   router.push(`/wrestler/${data}`);
   router.refresh();
  },
 });

 const { mutate: updateWrestler, isLoading: isLoadingUpdate } = useMutation({
  mutationFn: async () => {
   const payload: CreateWrestlerPayload = {
    name,
    realname,
    sex,
    city,
    country,
    height: parseFloat(height),
    weight: parseFloat(weight),
    styles: styles.split(",").filter((style) => style.trim()),
    trainers: trainers.split(",").filter((trainer) => trainer.trim()),
    nicknames: nicknames.split(",").filter((nickname) => nickname.trim()),
    birth: birth === "" ? undefined : birth,
    careerstart: careerstart === "" ? undefined : careerstart,
    isVendetta: isVendetta !== "No",
    wrestler_img: imgUrl || undefined,
    moves: moves.replace(/\s/g, "").split(","),
    reigns: reigns.filter((reign) => reign.titleId !== 0),
   };
   const { data } = await axios.put(
    `/api/wrestler?id=${wrestler!.id}`,
    payload
   );
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
   router.push(`/wrestler/${data}`);
   router.refresh();
  },
 });

 return (
  <div className="flex flex-col items-center gap-10 w-full">
   <Label className="font-bold">
    {wrestler ? "Editing wrestler..." : "Creating new wrestler..."}
   </Label>
   <div className="w-full">
    <Label size="medium" className="font-bold text-start mb-5">
     Personal data:
    </Label>
    <div className="grid grid-cols-3 gap-5">
     <Dropdown
      array={["Male", "Female", "Undefined"]}
      value={sex}
      setValue={setSex}
      placeholder="Choose sex..."
     />
     <Input
      placeholder="Height"
      value={height}
      setValue={setHeight}
      type="number"
      isError={isError && height.length === 0}
     />
     <Input
      placeholder="Weight"
      value={weight}
      setValue={setWeight}
      type="number"
      isError={isError && weight.length === 0}
     />
     <Input
      placeholder="Date of birth"
      value={birth}
      setValue={setBirth}
      type="date"
     />
     <Input placeholder="Country" value={country} setValue={setCountry} />
     <Input placeholder="City" value={city} setValue={setCity} />
     <Input placeholder="Real name" value={realname} setValue={setRealname} />
    </div>
   </div>
   <div className="w-full">
    <Label size="medium" className="font-bold text-start mb-5">
     Wrestling data:
    </Label>
    <div className="grid grid-cols-3 gap-5 items-center">
     <Input
      placeholder="In-ring name"
      value={name}
      setValue={setName}
      isError={isError && name.length === 0}
     />
     <Input
      placeholder="Start of career"
      value={careerstart}
      setValue={setCareerstart}
      type="date"
     />
     <Dropdown
      array={["Yes", "No"]}
      value={isVendetta}
      setValue={setIsVendetta}
      placeholder="Signd to Vendetta? (YES by default)"
     />
     <Input
      placeholder="Wrestling style(s) (enter with ,)"
      value={styles}
      setValue={setStyles}
     />
     <Input
      placeholder="Trainer(s) (enter with ,)"
      value={trainers}
      setValue={setTrainers}
     />
     <Input
      placeholder="Key move(s) (enter with ,)"
      value={moves}
      setValue={setMoves}
     />
     <Input
      placeholder="Nickname(s) (enter with ,)"
      value={nicknames}
      setValue={setNicknames}
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
       onChange={uploadAvatar}
      />
     </div>
    </div>
   </div>

   <div className="w-full flex flex-col gap-7">
    <Label size="medium" className="font-bold text-start">
     Титульные рейны:
    </Label>
    {reigns.map((reign, index) => (
     <div key={index} className="grid grid-cols-3 gap-5 items-center">
      <Dropdown
       placeholder="Выберите титул"
       array={[...titles].map((title) => title.name)}
       value={reign.titleName}
       setValue={(newVal) =>
        setReigns((prev) => {
         const newReigns = [...prev];
         newReigns[index].titleName = newVal;
         newReigns[index].titleId = titles.find((t) => (t.name = newVal))!.id;
         newReigns[index].titleCurName = newVal;
         return newReigns;
        })
       }
      />
      <Input
       placeholder="Название титула в рейне"
       value={reign.titleCurName}
       setValue={(newVal) =>
        setReigns((prev) => {
         const newReigns = [...prev];
         newReigns[index].titleCurName = newVal;
         return newReigns;
        })
       }
      />
      <Input
       placeholder="Имя рестлера в рейне"
       value={reign.wrestlerName}
       setValue={(newVal) =>
        setReigns((prev) => {
         const newReigns = [...prev];
         newReigns[index].wrestlerName = newVal;
         return newReigns;
        })
       }
      />
      <Input
       placeholder="Начало"
       type="date"
       value={reign.start}
       setValue={(newVal) =>
        setReigns((prev) => {
         const newReigns = [...prev];
         newReigns[index].start = newVal;
         return newReigns;
        })
       }
      />
      <Input
       placeholder="Конец"
       type="date"
       value={reign.end}
       setValue={(newVal) =>
        setReigns((prev) => {
         const newReigns = [...prev];
         newReigns[index].end = newVal;
         return newReigns;
        })
       }
      />
     </div>
    ))}

    <Button
     variant={"subtle"}
     className="w-full"
     onClick={() =>
      setReigns((prev) => {
       const p = [...prev];
       p.push({
        titleId: 0,
        titleName: "",
        titleCurName: "",
        wrestlerName: name,
        start: "",
        end: "",
       });
       return p;
      })
     }
    >
     + Добавить рейн
    </Button>
   </div>
   <Button
    isLoading={isLoading || isLoadingUpdate}
    onClick={() => {
     setIsError(true);
     wrestler ? updateWrestler() : createWrestler();
    }}
    size="lg"
    className="w-1/2"
   >
    {wrestler ? "Update" : "Create"}
   </Button>
  </div>
 );
};

export default WrestlerForm;
