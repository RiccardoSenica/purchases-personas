import { useState } from 'react';
import { Consumer, consumerSchema } from '@utils/consumer/types';
import { PurchaseList, purchasesRequestSchema } from '@purchases/types';
import { Button } from './Button';
import { useToast } from '../context/toast/ToastContext';
import { Toasts } from './Toast';
import {
  LineChart,
  PersonStanding,
  KeyRound,
  Download,
  Sparkles
} from 'lucide-react';

export const Content = () => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [consumer, setConsumer] = useState<Consumer | null>(null);
  const [purchasesError, setPurchasesError] = useState<string | null>(null);
  const [editedConsumer, setEditedConsumer] = useState('');
  const [purchasesResult, setPurchasesResult] = useState<PurchaseList | null>(
    null
  );
  const { showToast, toasts } = useToast();

  const downloadJson = (data: Consumer | PurchaseList, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadConsumer = () => {
    if (!consumer) return;
    try {
      downloadJson(consumer, 'consumer.json');
    } catch (err) {
      showToast('Failed to download consumer data');
    }
  };

  const handleDownloadPurchases = () => {
    if (!purchasesResult) return;
    try {
      downloadJson(purchasesResult, 'purchases.json');
    } catch (err) {
      showToast('Failed to download purchase history');
    }
  };

  const handleGenerateConsumer = async () => {
    if (!apiKey.trim()) {
      showToast('Please enter an API key');
      return;
    }

    setLoading(true);
    setConsumer(null);
    setPurchasesError(null);
    setEditedConsumer('');
    setPurchasesResult(null);

    try {
      const response = await fetch('/api/consumer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate consumer');
      }

      const data = await response.json();
      setConsumer(data);
      setEditedConsumer(JSON.stringify(data, null, 2));
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleJsonEdit = (value: string) => {
    setEditedConsumer(value);
    try {
      const parsed = JSON.parse(value);
      const validConsumer = consumerSchema.safeParse(parsed);
      if (!validConsumer.success) {
        setPurchasesError('Invalid consumer format');
        return;
      }
      setPurchasesError(null);
    } catch {
      setPurchasesError('Invalid JSON format');
    }
  };

  const handleGeneratePurchases = async () => {
    if (purchasesError) {
      showToast('Please fix the JSON errors before submitting');
      return;
    }

    setSubmitting(true);
    setPurchasesResult(null);

    try {
      const jsonData = JSON.parse(editedConsumer);
      const requestData = { consumer: jsonData, apiKey };

      const validationResult = purchasesRequestSchema.safeParse(requestData);
      if (!validationResult.success) {
        throw new Error(validationResult.error.issues[0].message);
      }

      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate purchases');
      }

      const data = await response.json();
      setPurchasesResult(data);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen relative'>
      <div
        className='fixed inset-0 bg-white'
        style={{
          backgroundImage: `
          linear-gradient(30deg, #e2e8f0 12%, transparent 12.5%, transparent 87.5%, #e2e8f0 87.5%, #e2e8f0),
          linear-gradient(150deg, #e2e8f0 12%, transparent 12.5%, transparent 87.5%, #e2e8f0 87.5%, #e2e8f0),
          linear-gradient(30deg, #e2e8f0 12%, transparent 12.5%, transparent 87.5%, #e2e8f0 87.5%, #e2e8f0),
          linear-gradient(150deg, #e2e8f0 12%, transparent 12.5%, transparent 87.5%, #e2e8f0 87.5%, #e2e8f0),
          linear-gradient(60deg, rgba(226,232,240,0.25) 25%, transparent 25.5%, transparent 75%, rgba(226,232,240,0.25) 75%, rgba(226,232,240,0.25)),
          linear-gradient(60deg, rgba(226,232,240,0.25) 25%, transparent 25.5%, transparent 75%, rgba(226,232,240,0.25) 75%, rgba(226,232,240,0.25))
        `,
          backgroundSize: '80px 140px',
          backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px',
          opacity: 0.4
        }}
      />
      <div className='container mx-auto px-4 py-12'>
        <Toasts toasts={toasts} />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto mb-12'>
          <div className='bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-xl p-8'>
            <div className='flex items-center gap-4 mb-6'>
              <div className='p-3 bg-blue-100 rounded-xl'>
                <KeyRound className='w-6 h-6 text-blue-600' />
              </div>
              <div>
                <h2 className='text-xl font-semibold text-slate-900'>
                  API Authentication
                </h2>
                <p className='text-slate-600 mt-1'>
                  Enter your Anthropic API key to get started
                </p>
              </div>
            </div>
            <div className='space-y-4'>
              <div className='relative'>
                <input
                  id='apiKey'
                  type='password'
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  className='w-full px-4 py-3 border border-slate-200 rounded-xl
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                           text-slate-900 bg-white transition-all duration-200
                           placeholder-slate-400'
                  placeholder='Enter your API key'
                  disabled={loading || submitting}
                />
              </div>
              <div className='pt-3 space-y-2'>
                <p className='text-sm text-slate-600 border-t border-slate-200 pt-3'>
                  Need an API key? Visit{' '}
                  <a
                    href='https://console.anthropic.com/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:text-blue-700 font-medium'
                  >
                    Anthropic Console
                  </a>{' '}
                  to get one.
                </p>
                <p className='text-xs text-slate-500'>
                  Your API key is only used to make requests and is never
                  stored.
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-xl p-8'>
            <div className='flex items-center gap-4 mb-4'>
              <div className='p-3 bg-indigo-100 rounded-xl'>
                <Sparkles className='w-6 h-6 text-indigo-600' />
              </div>
              <div>
                <h2 className='text-xl font-semibold text-slate-900'>
                  Quick Start
                </h2>
                <p className='text-slate-600 mt-1'>
                  Generate synthetic data in minutes
                </p>
              </div>
            </div>
            <ol className='list-decimal list-inside text-sm text-slate-600 mb-4 pl-1'>
              <li className='mb-1'>Enter your API key</li>
              <li className='mb-1'>Generate a consumer profile</li>
              <li className='mb-1'>Review the generated data</li>
              <li>Generate purchase history</li>
            </ol>
            <div className='flex gap-3'>
              <a
                href='/samples/consumer.json'
                download
                className='flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 
                         text-slate-700 rounded-lg text-sm font-medium transition-colors'
              >
                <Download className='w-4 h-4' />
                Sample Consumer
              </a>
              <a
                href='/samples/purchases.json'
                download
                className='flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 
                         text-slate-700 rounded-lg text-sm font-medium transition-colors'
              >
                <Download className='w-4 h-4' />
                Sample Purchases
              </a>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto'>
          <div className='bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300'>
            <div className='p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50'>
              <div className='flex items-center gap-4'>
                <div className='p-2 bg-blue-100 rounded-lg'>
                  <PersonStanding className='w-5 h-5 text-blue-600' />
                </div>
                <h2 className='text-xl font-semibold text-slate-900'>
                  Consumer Data
                </h2>
              </div>
            </div>
            <div className='p-8 space-y-6'>
              <Button
                loading={loading}
                disabled={loading || submitting}
                labelLoading='Generating consumer... (it can take up to 30 seconds)'
                labelReady='Generate Consumer Profile'
                onClick={handleGenerateConsumer}
              />

              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <label className='text-sm font-medium text-slate-700'>
                    Edit Consumer Data
                  </label>
                  {purchasesError && (
                    <span className='text-sm text-red-600 bg-red-50 px-4 py-1 rounded-full'>
                      {purchasesError}
                    </span>
                  )}
                </div>
                <div className='relative'>
                  <textarea
                    value={editedConsumer}
                    onChange={e => handleJsonEdit(e.target.value)}
                    className='w-full h-96 p-4 font-mono text-sm
                             bg-slate-50 rounded-xl border border-slate-200 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                             resize-none transition-all duration-200'
                    spellCheck='false'
                    disabled={submitting}
                    placeholder={
                      consumer
                        ? ''
                        : 'Generated consumer profile will appear here'
                    }
                  />
                </div>
              </div>

              <Button
                labelReady='Download generated consumer data'
                onClick={handleDownloadConsumer}
                disabled={!consumer}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 rounded-lg text-sm font-medium transition-colors"
              />

              <Button
                loading={submitting}
                disabled={
                  !editedConsumer || Boolean(purchasesError) || submitting
                }
                labelLoading='Generating purchases... (it can take up to a minute)'
                labelReady='Generate Purchase History'
                onClick={handleGeneratePurchases}
              />
            </div>
          </div>

          <div className='bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300'>
            <div className='p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-blue-50'>
              <div className='flex items-center gap-4'>
                <div className='p-2 bg-blue-100 rounded-lg'>
                  <LineChart className='w-5 h-5 text-blue-600' />
                </div>
                <h2 className='text-xl font-semibold text-slate-900'>
                  Purchase History
                </h2>
              </div>
            </div>
            <div className='p-8'>
              <div className='h-[34rem] rounded-xl'>
                {purchasesResult ? (
                  <div className='h-full bg-slate-50 border border-slate-200 rounded-xl'>
                    <pre className='text-sm text-slate-700 whitespace-pre-wrap p-6 h-full overflow-auto'>
                      {JSON.stringify(purchasesResult, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div
                    className='flex flex-col items-center justify-center h-full 
                                bg-slate-50 border border-slate-200 rounded-xl gap-4'
                  >
                    <LineChart className='w-12 h-12 text-slate-300' />
                    <p className='text-sm font-medium text-slate-500'>
                      No purchase history generated yet
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className='px-8'>
              <Button
                labelReady='Download generated purchase history data'
                onClick={handleDownloadPurchases}
                disabled={!purchasesResult}
                className='w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 rounded-lg text-sm font-medium transition-colors'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
