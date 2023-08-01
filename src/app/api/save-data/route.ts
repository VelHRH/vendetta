import createClient from "@/lib/supabase-server";
import fsPromises from "fs/promises";
import path from "path";

export async function POST(req: Request) {
 try {
  const supabase = createClient();
  const tableArray = [
   "challanges",
   "comments_matches",
   "comments_shows",
   "comments_teams",
   "comments_titles",
   "comments_tournaments",
   "comments_wrestlers",
   "match_sides",
   "matches",
   "reigns",
   "shows",
   "teams",
   "teams_current_participants",
   "teams_former_participants",
   "titles",
   "tournaments",
   "users",
   "winners",
   "wrestlers",
  ];
  for (let table of tableArray) {
   const { data: challanges, error } = await supabase.from(table).select("*");
   if (error) throw error;
   const dataFilePath = path.join(process.cwd(), `/json/${table}.json`);
   const jsonData = JSON.stringify(challanges);

   await fsPromises.writeFile(dataFilePath, jsonData);
  }

  return new Response("Data saved successfuly", { status: 200 });
 } catch (error) {
  console.error("Error saving data:", error);
  return new Response("Error saving data:", { status: 500 });
 }
}
