import { Database, Sparkles } from 'lucide-react';

export const Header = () => {
  return (
    <header className='bg-gradient-to-r from-blue-600 to-indigo-600 z-50'>
      <div className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center gap-6'>
          <div className='p-4 bg-white/10 rounded-2xl backdrop-blur-sm'>
            <Database className='text-white w-10 h-10' />
          </div>
          <div>
            <div className='flex items-center gap-3 mb-3'>
              <h1 className='text-3xl font-bold text-white'>
                Synthetic Consumer Generator
              </h1>
              <span className='px-3 py-1 text-xs font-medium text-blue-100 bg-white/10 rounded-full backdrop-blur-sm'>
                Beta
              </span>
            </div>
            <div className='flex items-center gap-2 text-blue-100'>
              <Sparkles className='w-4 h-4' />
              <p>
                Generate realistic customer profiles and purchase histories in
                seconds
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
