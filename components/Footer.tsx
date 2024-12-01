import { AlertTriangle, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className='bg-slate-900 fixed bottom-0 left-0 right-0 z-50'>
      <div className='max-w-[100rem] mx-auto py-4 px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 sm:grid-cols-3 items-center gap-4'>
          <p className='text-xs text-slate-400 text-center sm:text-left'>
            All data generated through this platform is AI-generated content
            intended for testing and development. Any resemblance to real
            persons, businesses, or events is purely coincidental. Users are
            responsible for ensuring compliance with applicable laws and
            regulations.
          </p>
          <div className='flex items-center justify-center gap-2 text-amber-400 order-first sm:order-none'>
            <AlertTriangle className='w-5 h-5' />
            <p className='font-medium'>Use Responsibly</p>
          </div>
          <div className='flex items-center justify-center sm:justify-end gap-2'>
            <Mail className='w-4 h-4 text-slate-400' />
            <a
              href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
              className='text-sm text-slate-400 hover:text-slate-300'
            >
              {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
