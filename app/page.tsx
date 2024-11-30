'use client';

import { Footer } from '@components/Footer';
import { Header } from '@components/Header';
import { Content } from '@components/Content';
import { ToastProvider } from '../context/toast/ToastProvider';

export default function Home() {
  return (
    <ToastProvider>
      <div className='min-h-screen flex flex-col bg-gray-50'>
        <Header />
        <main className='flex-1 py-8'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex flex-col lg:flex-row gap-6'>
              <Content />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
}
