import { Database, Sparkles } from 'lucide-react';

export const Header = () => {
  return (
    <header className='bg-gradient-to-r from-blue-600 to-indigo-600 fixed top-0 left-0 right-0 z-50'>
      <div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center gap-4'>
          <div className='p-3 bg-white/10 rounded-xl backdrop-blur-sm'>
            <Database className='text-white w-8 h-8' />
          </div>
          <div>
            <div className='flex items-center gap-3'>
              <h1 className='text-2xl font-bold text-white'>
                Synthetic Consumer Generator
              </h1>
              <span className='px-2 py-0.5 text-xs font-medium text-blue-100 bg-white/10 rounded-full backdrop-blur-sm'>
                Beta
              </span>
            </div>
            <div className='flex items-center gap-2 text-blue-100 mt-1'>
              <Sparkles className='w-4 h-4' />
              <p className='text-sm'>
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
