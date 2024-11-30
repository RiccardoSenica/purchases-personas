import { useState } from 'react';
import { consumer, consumerSchema } from '@utils/consumer/types';
import { PurchaseList, purchasesRequestSchema } from '@purchases/types';
import { Purchases } from './Purchases';
import { Button } from './Button';
import { useToast } from '../context/toast/ToastContext';
import { Toasts } from './Toast';
import { PersonStanding } from 'lucide-react';
import { CardTitle } from './CardTitle';

export const Content = () => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [consumer, setConsumer] = useState<consumer | null>(null);
  const [purchasesError, setPurchasesError] = useState<string | null>(null);
  const [editedConsumer, setEditedConsumer] = useState('');
  const [purchasesResult, setPurchasesResult] = useState<PurchaseList | null>(
    null
  );
  const { showToast, toasts } = useToast();

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
    <div className='container mx-auto flex flex-col lg:flex-row gap-6'>
      <Toasts toasts={toasts} />
      <div className='lg:w-1/2 w-full'>
        <div className='bg-white rounded-lg border shadow-lg hover:shadow-xl transition-shadow'>
          <CardTitle
            title='Consumer'
            icon={<PersonStanding className='w-5 h-5 text-blue-900' />}
          />
          <div className='p-6 space-y-6'>
            <div className='space-y-2'>
              <label
                htmlFor='apiKey'
                className='block text-sm font-medium text-gray-700'
              >
                Anthropic API Key
              </label>
              <input
                id='apiKey'
                type='password'
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900'
                placeholder='Enter your API key'
                disabled={loading || submitting}
              />
            </div>

            <Button
              loading={loading}
              disabled={loading || submitting}
              labelLoading='Generating consumer... (it can take up to 30 seconds)'
              labelReady='Generate consumer'
              onClick={handleGenerateConsumer}
            />

            <div className='space-y-2'>
              <div className='flex justify-between items-center'>
                <label
                  htmlFor='purchases'
                  className='block text-sm font-medium text-gray-700'
                >
                  Editable consumer
                </label>
                {purchasesError && (
                  <span className='text-sm text-red-600'>{purchasesError}</span>
                )}
              </div>
              <textarea
                id='purchases'
                value={editedConsumer}
                onChange={e => handleJsonEdit(e.target.value)}
                className='w-full h-96 p-4 font-mono text-sm bg-gray-50 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none'
                spellCheck='false'
                disabled={submitting}
                placeholder={
                  consumer ? '' : 'Generated consumer will appear here'
                }
              />
            </div>

            <Button
              loading={submitting}
              disabled={
                !editedConsumer || Boolean(purchasesError) || submitting
              }
              labelLoading='Generating purchases... (it can take up to a minute)'
              labelReady='Generate purchases'
              onClick={handleGeneratePurchases}
            />
          </div>
        </div>
      </div>

      <div className='lg:w-1/2 w-full'>
        <Purchases purchases={purchasesResult} />
      </div>
    </div>
  );
};
