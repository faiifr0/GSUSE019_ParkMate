import { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Danh sách chi nhánh | ParkMate",
  description:
    "This is Next.js Park Branches List page for ParkMate",
  // other metadata
};

export default function ParkBranchesLayout({ children }: { children: ReactNode }) {
  return (        
    <>
      {children}
    </>      
  );
}