import ShowForm from "@/components/Add/ShowForm";
import { Metadata } from "next";

export const metadata: Metadata = {
 title: "Добавление шоу",
 description: "Добавление шоу",
};

const AddShow = () => {
 return <ShowForm />;
};

export default AddShow;
