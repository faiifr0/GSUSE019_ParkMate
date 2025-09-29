import { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Thông tin người dùng | ParkMate",
  description:
    "This is Next.js User Info page for ParkMate",
};

export default function UsersLayout({ children }: { children: ReactNode }) {
  return (        
    <>
      {children}
    </>      
  );
}