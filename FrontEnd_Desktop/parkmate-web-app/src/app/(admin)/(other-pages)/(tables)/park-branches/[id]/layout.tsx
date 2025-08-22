import { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Park Branch Overview Info | ParkMate",
  description:
    "This is Next.js Park Branch Overview Info page for ParkMate",
  // other metadata
};

export default function ParkBranchOverviewLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}