import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// eslint-disable-next-line import/no-anonymous-default-export
export default () => createServerComponentClient<Database>({ cookies });
