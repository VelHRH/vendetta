import TeamForm from "@/components/Add/TeamForm";
import { Metadata } from "next";

export const metadata: Metadata = {
 title: "Добавление команд",
 description: "Добавление команд",
};

const AddTeam = () => {
 return <TeamForm />;
};

export default AddTeam;
