import createClient from '@/lib/supabase-server';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { option_id, voter } = body;
    const supabase = createClient();
    const { data } = await supabase.from('poll_options').select().eq('id', option_id).single();
    if (!data) throw 'No such option';
    console.log({ option_id, voter });
    const { error } = await supabase
      .from('poll_options')
      .update({
        voters: [...data.voters, voter.id],
      })
      .eq('id', option_id);
    if (error) throw error.message;
    return new Response();
  } catch (err) {
    console.log(err);
    if (err instanceof z.ZodError) {
      return new Response(err.message, { status: 422 });
    }
    if (typeof err === 'string') return new Response(err, { status: 400 });
    return new Response('Error while voting', { status: 500 });
  }
}
