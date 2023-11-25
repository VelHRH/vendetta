'use client';
import { useState } from 'react';
import { Button } from '../ui/Button';
import Input from '../ui/Input';
import Label from '../ui/Label';

const PollForm = () => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [options, setOptions] = useState<{ name: string; link: string }[]>([]);
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
              value={option.link}
              setValue={newVal =>
                setOptions(prev => {
                  const p = [...prev];
                  p[index].link = newVal;
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
                link: '',
              },
            ])
          }
        >
          + Добавить вариант
        </Button>
      </div>
    </div>
  );
};

export default PollForm;
