import { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Danh sách người dùng | ParkMate",
  description:
    "This is Next.js User List page for ParkMate",
  // other metadata
};

export default function UsersLayout({ children }: { children: ReactNode }) {
  return (        
    <>
      {children}
    </>      
  );
}