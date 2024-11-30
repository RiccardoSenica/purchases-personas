import { AlertCircle } from 'lucide-react';
import { Toast } from '../context/toast/ToastContext';

interface ToastsProps {
  toasts: Toast[];
}

export const Toasts = ({ toasts }: ToastsProps) => {
  return (
    <div className='fixed bottom-4 left-4 z-[9999] space-y-2'>
      {toasts.map(toast => {
        return (
          <div
            key={toast.id}
            className='flex items-center gap-2 p-3 text-red-600 bg-red-50 rounded-lg border border-red-200 shadow-lg hover:shadow-xl'
          >
            <AlertCircle className='h-5 w-5 shrink-0' />
            <p className='text-sm'>{toast.message}</p>
          </div>
        );
      })}
    </div>
  );
};
