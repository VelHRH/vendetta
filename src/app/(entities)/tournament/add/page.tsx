import TournamentForm from "@/components/Add/TournamentForm";
import { Metadata } from "next";

export const metadata: Metadata = {
 title: "Добавление турнира",
 description: "Добавление турнира",
};

const AddTournament = () => {
 return <TournamentForm />;
};

export default AddTournament;
