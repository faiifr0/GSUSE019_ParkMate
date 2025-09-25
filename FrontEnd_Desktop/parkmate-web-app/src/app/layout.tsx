import { Quicksand } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/components/context/SidebarContext';
import { AuthProvider } from '@/components/context/AuthContext';

const outfit = Quicksand ({
  subsets: ["vietnamese"],
  weight: ['400', '700'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body className={`${outfit.className} dark:bg-gray-900`}> 
        <AuthProvider>       
          <SidebarProvider>
            {children}
          </SidebarProvider>                
        </AuthProvider>
      </body>      
    </html>
  );
}