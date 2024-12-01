'use client';

import { Footer } from '@components/Footer';
import { Header } from '@components/Header';
import { Content } from '@components/Content';
import { ToastProvider } from '../context/toast/ToastProvider';

export default function Home() {
  return (
    <ToastProvider>
      <div className='min-h-screen flex flex-col'>
        <Header />
        <main className='flex-1'>
          <Content />
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
}
