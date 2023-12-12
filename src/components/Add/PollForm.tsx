'use client';
import { CreatePollPayload } from '@/lib/validators/poll';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../ui/Button';
import Input from '../ui/Input';
import Label from '../ui/Label';

const PollForm = () => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [options, setOptions] = useState<{ name: string; url?: string; voters: string[] }[]>([]);

  const router = useRouter();

  const { mutate: createPoll, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreatePollPayload = {
        name,
        description,
        options: options.filter(option => option.name !== ''),
      };
      const { data } = await axios.post('/api/poll', payload);
      return data as string;
    },
    onError: err => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 422) {
          return toast({
            title: 'Input error',
            description: 'Not all fields are filled out correctly',
            variant: 'destructive',
          });
        }
      }
      toast({
        title: 'There was an error',
        description: 'Could not create the poll',
        variant: 'destructive',
      });
    },
    onSuccess: data => {
      router.push(`/poll/${data}`);
      router.refresh();
    },
  });

  return (
    <div className="flex flex-col items-center gap-10 w-full">
      <Label className="font-bold">Создание опроса...</Label>
      <div className="w-full">
        <Label size="medium" className="font-bold text-start mb-5">
          Данные опроса
        </Label>
        <div className="grid grid-cols-3 gap-5">
          <Input
            placeholder="Название"
            value={name}
            setValue={setName}
            isError={isError && name.length === 0}
          />
          <Input placeholder="Описание" value={description} setValue={setDescription} />
        </div>
        <Label size="medium" className="font-bold text-start my-5">
          Варианты
        </Label>
        {options.map((option, index) => (
          <div key={index} className="grid grid-cols-3 gap-5 mb-5">
            <Input
              placeholder="Заголовок"
              value={option.name}
              setValue={newVal =>
                setOptions(prev => {
                  const p = [...prev];
                  p[index].name = newVal;
                  return p;
                })
              }
              isError={isError && option.name.length === 0}
            />
            <Input
              placeholder="Сcылка (если надо)"
              value={option.url || ''}
              setValue={newVal =>
                setOptions(prev => {
                  const p = [...prev];
                  p[index].url = newVal;
                  return p;
                })
              }
            />
          </div>
        ))}
        <Button
          variant={'subtle'}
          className="w-full"
          onClick={() =>
            setOptions(prev => [
              ...prev,
              {
                name: '',
                voters: [],
              },
            ])
          }
        >
          + Добавить вариант
        </Button>
      </div>
      <Button
        isLoading={isLoading}
        onClick={() => {
          setIsError(true);
          createPoll();
        }}
        size="lg"
        className="w-1/2"
      >
        {'Create'}
      </Button>
    </div>
  );
};

export default PollForm;
