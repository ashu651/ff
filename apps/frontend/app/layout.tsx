import './globals.css';
import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { QueryClientProvider } from '../providers/QueryClientProvider';
import { Inter } from 'next/font/google';
import { Navbar } from '../components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Snapzy',
  description: 'Share photos and videos with the world',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white text-gray-900 dark:bg-black dark:text-gray-100`}> 
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryClientProvider>
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 py-4">{children}</main>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}