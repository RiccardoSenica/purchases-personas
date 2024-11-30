import { Database } from 'lucide-react';

export const Header = () => {
  return (
    <header className='bg-gradient-to-r from-blue-900 to-blue-800'>
      <div className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center space-x-4'>
          <Database className='text-white w-10 h-10' />
          <div>
            <h1 className='text-3xl font-bold text-white'>
              Synthetic Consumer Generator
            </h1>
            <p className='mt-2 text-blue-100'>
              Generate synthetic customer and purchasing history
              data
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
