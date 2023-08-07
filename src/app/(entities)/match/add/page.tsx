import MatchForm from "@/components/Add/MatchesForm";
import { Metadata } from "next";

export const metadata: Metadata = {
 title: "Добавление матча",
 description: "Добавление матча",
};

const AddMatch = () => {
 return <MatchForm />;
};

export default AddMatch;
