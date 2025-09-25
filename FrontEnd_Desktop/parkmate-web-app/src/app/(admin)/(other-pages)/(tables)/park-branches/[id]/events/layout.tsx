import { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Các sự kiện của chi nhánh | ParkMate",
  description:
    "This is Next.js Park Branch Events page for ParkMate",
  // other metadata
};

export default function ParkBranchEventsLayout({ children }: { children: ReactNode }) {
  return (
    <>{children}</>
  );
}