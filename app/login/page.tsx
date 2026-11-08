import { Metadata } from 'next';
import VirusLogo from '@/app/ui/virus-logo';
import LoginForm from '@/app/ui/login-form';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-6 p-4 md:-mt-24">
        <div className="flex justify-center">
          <VirusLogo className="text-3xl" markClassName="h-11 w-11" />
        </div>
        <div className="animate-fade-up">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
