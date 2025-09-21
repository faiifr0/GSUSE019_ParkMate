import { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Các loại vé của chi nhánh | ParkMate",
  description:
    "This is Next.js Park Branch Tickets page for ParkMate",
  // other metadata
};

export default function ParkBranchTicketsLayout({ children }: { children: ReactNode }) {
  return (
    <>{children}</>
  );
}