import { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Shift | ParkMate",
  description:
    "This is Next.js Shift page for ParkMate",
  // other metadata
};

export default function ShiftLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}