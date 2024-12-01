import { AlertTriangle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className='bg-slate-900 z-50'>
      <div className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col items-center gap-4'>
          <div className='flex items-center gap-2 text-amber-400'>
            <AlertTriangle className='w-5 h-5' />
            <p className='font-medium'>Use Responsibly</p>
          </div>
          <div className='text-center space-y-2'>
            <p className='text-sm text-slate-300'>
              Synthetic Data Generator - For testing and development purposes
              only
            </p>
            <p className='text-xs text-slate-400 max-w-2xl'>
              All data generated through this platform is AI-generated content
              intended for testing and development. Any resemblance to real
              persons, businesses, or events is purely coincidental. Users are
              responsible for ensuring compliance with applicable laws and
              regulations.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
