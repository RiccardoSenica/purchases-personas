import { ReactElement } from 'react';

interface CardTitleProps {
  title: string;
  icon: ReactElement;
}

export const CardTitle = ({ title, icon }: CardTitleProps) => {
  return (
    <div className='px-6 py-4 border-b bg-gradient-to-r from-blue-100 to-blue-50'>
      <div className='flex items-center space-x-2'>
        {icon}
        <h2 className='text-xl font-semibold text-gray-600'>{title}</h2>
      </div>
    </div>
  );
};
