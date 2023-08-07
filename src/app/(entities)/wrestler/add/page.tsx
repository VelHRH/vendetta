import WrestlerForm from "@/components/Add/WrestlerForm";
import { Metadata } from "next";

export const metadata: Metadata = {
 title: "Добавление рестлера",
 description: "Добавление рестлера",
};

const AddWrestler = () => {
 return <WrestlerForm />;
};

export default AddWrestler;
