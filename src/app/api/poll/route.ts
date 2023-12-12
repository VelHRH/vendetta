import createClient from '@/lib/supabase-server';
import { z } from 'zod';
import { PollValidator } from '@/lib/validators/poll';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const poll = PollValidator.parse(body);

    const supabase = createClient();

    const { data, error } = await supabase
      .from('polls')
      .insert({
        name: poll.name,
        description: poll.description,
      })
      .select()
      .single();
    if (error) throw error.message;

    for (let option of poll.options) {
      const { error: optionError } = await supabase.from('poll_options').insert({
        poll: data!.id,
        name: option.name,
        url: option.url,
        voters: option.voters,
      });

      if (optionError) throw optionError.message;
    }

    return new Response(data!.id.toString());
  } catch (err) {
    console.log(err);
    if (err instanceof z.ZodError) {
      return new Response(err.message, { status: 422 });
    }
    if (typeof err === 'string') return new Response(err, { status: 400 });
    return new Response('Error while creating', { status: 500 });
  }
}
