"use client";
import { FC, useState } from "react";
import Dropdown from "@/components/ui/Dropdown";
import Label from "../ui/Label";
import Input from "../ui/Input";
import { Button } from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import { CreateWrestlerPayload } from "@/lib/validators/wrestler";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const AddWrestlerForm: FC = () => {
 const [sex, setSex] = useState<string>("");
 const [realname, setRealname] = useState<string>("");
 const [height, setHeight] = useState<string>("");
 const [weight, setWeight] = useState<string>("");
 const [birth, setBirth] = useState<string>("");
 const [city, setCity] = useState<string>("");
 const [country, setCountry] = useState<string>("");
 const [name, setName] = useState<string>("");
 const [styles, setStyles] = useState<string>("");
 const [trainers, setTrainers] = useState<string>("");
 const [moves, setMoves] = useState<string>("");
 const [careerstart, setCareerstart] = useState<string>("");
 const [isSelectSex, setIsSelectSex] = useState<boolean>(false);
 const [isError, setIsError] = useState<boolean>(false);

 const router = useRouter();

 const { mutate: createWrestler, isLoading } = useMutation({
  mutationFn: async () => {
   setIsError(true);
   const payload: CreateWrestlerPayload = {
    name,
    realname,
    sex,
    city,
    country,
    height: parseFloat(height),
    weight: parseFloat(weight),
    styles: styles.replace(/\s/g, "").split(","),
    trainers: trainers.replace(/\s/g, "").split(","),
    birth,
    careerstart,
    moves: moves.replace(/\s/g, "").split(","),
   };
   const { data } = await axios.post("/api/wrestler", payload);
   return data as string;
  },
  onError: (err) => {
   if (err instanceof AxiosError) {
    if (err.response?.status === 422) {
     console.log(err.response?.status);
     return toast({
      title: "Input error",
      description: "Not all fields are filled out correctly",
      variant: "destructive",
     });
    }
   }
   toast({
    title: "There was an eroor",
    description: "Could not create the wrestler",
    variant: "destructive",
   });
  },
  onSuccess: (data) => {
   router.push(`/wrestler/${data}`);
  },
 });

 return (
  <div className="flex flex-col items-center gap-10 w-full">
   <Label className="font-bold">Creating new wrestler...</Label>
   <div className="w-full">
    <Label size="medium" className="font-bold text-start mb-5">
     Personal data:
    </Label>
    <div className="grid grid-cols-3 gap-5">
     <Dropdown
      array={["Male", "Female", "Undefined"]}
      value={sex}
      setValue={setSex}
      isSelect={isSelectSex}
      setIsSelect={setIsSelectSex}
      placeholder="Choose sex..."
     />
     <Input
      placeholder="Height"
      value={height}
      setValue={setHeight}
      isError={isError && height.length === 0 ? true : false}
      type="number"
     />
     <Input
      placeholder="Weight"
      value={weight}
      setValue={setWeight}
      isError={isError && weight.length === 0 ? true : false}
      type="number"
     />
     <Input
      placeholder="Date of birth"
      value={birth}
      setValue={setBirth}
      isError={isError && birth.length === 0 ? true : false}
      type="date"
     />
     <Input
      placeholder="Country"
      value={country}
      setValue={setCountry}
      isError={isError && country.length === 0 ? true : false}
     />
     <Input
      placeholder="City"
      value={city}
      setValue={setCity}
      isError={isError && city.length === 0 ? true : false}
     />
     <Input
      placeholder="Real name"
      value={realname}
      setValue={setRealname}
      isError={isError && realname.length === 0 ? true : false}
     />
    </div>
   </div>
   <div className="w-full">
    <Label size="medium" className="font-bold text-start mb-5">
     Wrestling data:
    </Label>
    <div className="grid grid-cols-3 gap-5">
     <Input
      placeholder="In-ring name"
      value={name}
      setValue={setName}
      isError={isError && name.length === 0 ? true : false}
     />
     <Input
      placeholder="Start of career"
      value={careerstart}
      setValue={setCareerstart}
      isError={isError && careerstart.length === 0 ? true : false}
      type="date"
     />
     <Input
      placeholder="Wrestling style(s) (enter with ,)"
      value={styles}
      setValue={setStyles}
      isError={isError && styles.length === 0 ? true : false}
     />
     <Input
      placeholder="Trainer(s) (enter with ,)"
      value={trainers}
      setValue={setTrainers}
      isError={isError && trainers.length === 0 ? true : false}
     />
     <Input
      placeholder="Key move(s) (enter with ,)"
      value={moves}
      setValue={setMoves}
      isError={isError && moves.length === 0 ? true : false}
     />
    </div>
   </div>
   <Button
    isLoading={isLoading}
    onClick={() => createWrestler()}
    size="lg"
    className="w-1/2"
   >
    Create
   </Button>
  </div>
 );
};

export default AddWrestlerForm;
