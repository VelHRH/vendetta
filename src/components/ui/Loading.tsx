import { FC } from 'react';

const Loading: FC = () => {
  return (
    <div className="flex flex-wrap justify-around pb-5 px-4 mt-3">
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className="flex flex-col min-h-52 w-[48%] bg-gray-300 animate-pulse mt-2 rounded-lg"
          style={{ animationDelay: `${i * 0.05}s`, animationDuration: '1s' }}
        ></div>
      ))}
    </div>
  );
};

export default Loading;
