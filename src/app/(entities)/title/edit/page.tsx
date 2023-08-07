import TitleForm from "@/components/Add/TitleForm";
import createClient from "@/lib/supabase-server";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
 title: "Исправление титула",
 description: "Исправление титула",
};

const EditTitle = async ({
 searchParams,
}: {
 searchParams: { id: string };
}) => {
 const supabase = createClient();
 const { data: title } = await supabase
  .from("titles")
  .select("*")
  .eq("id", searchParams.id)
  .single();
 if (!title) {
  notFound();
 }
 return <TitleForm title={title} />;
};

export default EditTitle;
