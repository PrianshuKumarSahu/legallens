'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DemoLoginButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'nav';
  label?: string;
}

export default function DemoLoginButton({
  className,
  variant = 'primary',
  label = '⚡ Instant Demo Access (For Judges)',
}: DemoLoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Request demo account credentials & verify seeded data
      const res = await fetch('/api/auth/demo', { method: 'POST' });
      const contentType = res.headers.get('content-type') || '';

      if (!res.ok) {
        let errorMsg = 'Failed to prepare demo credentials';
        if (contentType.includes('application/json')) {
          const errData = await res.json();
          errorMsg = errData.error || errorMsg;
        }
        throw new Error(errorMsg);
      }

      if (!contentType.includes('application/json')) {
        throw new Error('Received non-JSON response from server');
      }

      const { email, password } = await res.json();

      // 2. Sign in seamlessly with Supabase
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // 3. Navigate straight into the dashboard with sample documents
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      console.error('Demo login error:', err);
      setError(err.message || 'Demo login failed');
      setLoading(false);
    }
  };

  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed';

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl px-6 py-3 text-base ring-2 ring-amber-400/30',
    secondary:
      'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-5 py-2.5 text-sm shadow-sm',
    nav:
      'bg-amber-400 hover:bg-amber-300 text-indigo-950 font-bold px-4 py-2 text-sm shadow-md rounded-lg',
  };

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={handleDemoLogin}
        disabled={loading}
        className={cn(baseStyles, variantStyles[variant], className)}
        title="1-Click login without signup or email verification"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Loading Demo Environment...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2 text-yellow-200 animate-pulse" />
            {label}
          </>
        )}
      </button>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
}
