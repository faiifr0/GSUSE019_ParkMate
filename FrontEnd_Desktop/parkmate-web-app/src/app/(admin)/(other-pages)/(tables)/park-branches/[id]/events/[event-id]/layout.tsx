import { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Ảnh sự kiện của chi nhánh | ParkMate",
  description:
    "This is Next.js Park Branch Event's Image page for ParkMate",
  // other metadata
};

export default function ParkBranchEventImageLayout({ children }: { children: ReactNode }) {
  return (
    <>{children}</>
  );
}