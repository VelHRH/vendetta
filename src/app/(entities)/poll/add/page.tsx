import PollForm from '@/components/Add/PollForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Создание опроса',
  description: 'Создание опроса',
};

const AddPoll = () => {
  return <PollForm />;
};

export default AddPoll;
