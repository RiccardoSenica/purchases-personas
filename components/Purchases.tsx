import { PurchaseList } from '@purchases/types';
import { LineChart } from 'lucide-react';
import { CardTitle } from './CardTitle';

interface PurchasesProps {
  purchases: PurchaseList | null;
}

export const Purchases = ({ purchases }: PurchasesProps) => {
  return (
    <div className='bg-white rounded-lg border shadow-lg hover:shadow-xl transition-shadow h-full'>
      <CardTitle
        title='Purchasing history'
        icon={<LineChart className='w-5 h-5 text-blue-900' />}
      />
      <div className='p-6'>
        {purchases ? (
          <div className='bg-gray-50 rounded-lg border overflow-hidden h-[40rem]'>
            <pre className='text-sm text-gray-700 whitespace-pre-wrap p-4 h-full overflow-auto'>
              {JSON.stringify(purchases, null, 2)}
            </pre>
          </div>
        ) : (
          <div className='flex items-center justify-center h-[40rem] text-gray-400 bg-gray-50 rounded-lg border'>
            No purchases generated yet
          </div>
        )}
      </div>
    </div>
  );
};
