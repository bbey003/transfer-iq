import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { ToastProvider } from '@/components/ui/toast';
import { TransferStoreProvider } from '@/lib/transfer-store';

export const metadata: Metadata = {
  title: 'TransferIQ | Call Transfer Reporting & Coaching Dashboard',
  description: 'Internal enterprise app for call center teams to log, track, review, and analyze customer call transfers.',
  openGraph: {
    title: 'TransferIQ — Get Started',
    description: 'Internal enterprise app for call center teams to log, track, review, and analyze customer call transfers.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <AuthProvider>
          <TransferStoreProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </TransferStoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
