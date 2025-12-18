'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authenticate } from '@/app/actions';
import { useIMask } from 'react-imask';

import IMask from 'imask';

export default function LoginScreen() {
  const router = useRouter();
  const [credential, setCredential] = useState('');
  const [error, setError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Configure a smart Date mask with hooks
  const { ref, maskRef } = useIMask({
    mask: Date,
    pattern: 'd-m-Y',
    blocks: {
      d: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 31,
        maxLength: 2,
      },
      m: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 12,
        maxLength: 2,
      },
      Y: {
        mask: IMask.MaskedRange,
        from: 1900,
        to: 2099,
        maxLength: 4,
      }
    },
    format: (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    },
    parse: (str: string) => {
      const [d, m, y] = str.split('-').map(Number);
      return new Date(y, m - 1, d);
    },
    lazy: false,
    autofix: true,
    overwrite: true,
  } as any, 
  {
    onAccept: (value: string) => {
      setCredential(value);
    },
    onComplete: (value: string) => {
      handleAuth(value);
    }
  });

  const handleAuth = async (value: string) => {
    if (value.length === 10) {
      const result = await authenticate(value);
      if (result.success) {
        setError(false);
        setIsSuccess(true);
        setTimeout(() => {
          router.refresh();
        }, 1500);
      } else {
        setError(true);
        setTimeout(() => setError(false), 500);
      }
    } else {
      setError(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const currentVal = maskRef.current?.value || credential;
      handleAuth(currentVal);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-1000 ${isSuccess ? 'bg-white/50 backdrop-blur-sm' : ''}`}>
      <Card className={`glass-card border-none bg-transparent p-8 rounded-3xl max-w-md w-full text-center shadow-2xl transform transition-all duration-700 ${
        isSuccess ? 'scale-110 opacity-0 translate-y-[-20px]' : 'hover:scale-105'
      }`}>
        <CardContent className="p-0">
          <div className="mb-6">
            <i className={`fas fa-heart text-5xl animate-pulse ${isSuccess ? 'text-green-500' : 'text-pink-500'}`}></i>
          </div>
          <h2 className="text-3xl font-bold text-pink-600 mb-2 script-font">
            {isSuccess ? 'Welcome Home ❤️' : 'Welcome, my Love'}
          </h2>
          <p className="text-gray-700 mb-6">
            {isSuccess ? 'Unlocking our memories...' : 'Please enter our special date to verify it\'s you ❤️'}
          </p>
          
          <div className="relative">
            <Input 
              ref={ref as any}
              disabled={isSuccess}
              placeholder='DD-MM-YYYY'
              onKeyDown={handleKeyDown}
              className={`w-full bg-white/50 border-2 rounded-xl px-4 py-3 text-center text-2xl tracking-widest focus-visible:ring-2 focus-visible:ring-pink-200 focus-visible:ring-offset-0 placeholder:text-pink-300 transition-all font-mono h-16 ${
                error ? 'border-red-400 animate-shake' : 
                isSuccess ? 'border-green-400 text-green-600 bg-green-50' : 'border-pink-200 text-pink-600'
              }`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              {isSuccess ? (
                <i className="fas fa-check text-green-500 text-xl"></i>
              ) : (
                <i className="fas fa-key text-pink-400"></i>
              )}
            </div>
          </div>
          <p className={`text-red-500 text-sm mt-3 h-5 transition-opacity duration-300 ${error ? 'opacity-100' : 'opacity-0'}`}>
            Incorrect date, please try again
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
