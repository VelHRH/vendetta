import ShowForm from "@/components/Add/ShowForm";
import { Metadata } from "next";

export const metadata: Metadata = {
 title: "Добавление шоу",
 description: "Добавление шоу",
};

const AddShow = ({
 searchParams,
}: {
 searchParams: { mode?: string };
}) => {
 return (
  <ShowForm initialMode={searchParams.mode === "content" ? "content" : "show"} />
 );
};

export default AddShow;
