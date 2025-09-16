import { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Staff Shifts Inside | ParkMate",
  description:
    "This is Next.js Staff Shifts Inside page for ParkMate",
  // other metadata
};

export default function StaffShiftsInsideLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}