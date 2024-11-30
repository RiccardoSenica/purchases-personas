import { AlertCircle } from 'lucide-react';

export const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <div className='flex items-center gap-2 p-3 text-red-600 bg-red-50 rounded-lg border border-red-200'>
      <AlertCircle className='h-5 w-5 shrink-0' />
      <p className='text-sm'>{message}</p>
    </div>
  );
};
