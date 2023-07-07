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
import Dropdown from "../ui/Dropdown";
import InfoLabel from "../ui/InfoLabel";
import TournamentBracket from "../TournamentBracket";
import TournamentParticipants from "../TournamentParticipants";

const TournamentForm = ({
 tournament,
}: {
 tournament?: Database["public"]["Tables"]["tournaments"]["Row"];
}) => {
 const [name, setName] = useState<string>(tournament?.name || "");
 const [description, setDescription] = useState<string>(
  tournament?.description || ""
 );
 const [dateStart, setDateStart] = useState<string>(tournament?.start || "");
 const [dateEnd, setDateEnd] = useState<string>(tournament?.end || "");
 const [type, setType] = useState<string>(tournament?.type || "");
 const [playOff, setPlayOff] = useState<Json[]>(
  tournament?.play_off_participants || []
 );
 const [blocks, setBlocks] = useState<Json[] | null>(
  tournament?.block_participants || null
 );
 const [pass, setpass] = useState<string>(tournament?.pass?.toString() || "");
 const [isError, setIsError] = useState<boolean>(false);

 const router = useRouter();

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
   <div className="w-full">
    <Label size="medium" className="font-bold text-start mb-5">
     Добавление участников:
    </Label>
    <InfoLabel>
     Вы выбрали обычный тип для турнира. Это значит что вы должны выбрать
     количество участников и записать рестлеров в соответствующие ячейки. Справа
     выбирается рестлер из существующих. Слева - имя, под которым он будет
     выступать. Результрующая таблица показана ниже.
    </InfoLabel>
    <TournamentParticipants playOff={playOff} type="Обычный" />
   </div>
   <Button
    onClick={() => {
     setIsError(true);
    }}
    size="lg"
    className="w-1/2"
   >
    Create
   </Button>
  </div>
 );
};

export default TournamentForm;
