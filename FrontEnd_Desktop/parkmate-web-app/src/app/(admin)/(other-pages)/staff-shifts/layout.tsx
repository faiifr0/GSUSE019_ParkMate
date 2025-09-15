import { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Staff Shift | ParkMate",
  description:
    "This is Next.js Staff Shifts page for ParkMate",
  // other metadata
};

export default function StaffShiftsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}