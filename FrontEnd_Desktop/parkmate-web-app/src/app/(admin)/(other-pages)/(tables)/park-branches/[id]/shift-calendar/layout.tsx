import { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Lịch làm việc chi nhánh | ParkMate",
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