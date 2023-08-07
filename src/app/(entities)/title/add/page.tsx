import TitleForm from "@/components/Add/TitleForm";
import { Metadata } from "next";

export const metadata: Metadata = {
 title: "Добавление титула",
 description: "Добавление титула",
};

const AddTitle = () => {
 return <TitleForm />;
};

export default AddTitle;
