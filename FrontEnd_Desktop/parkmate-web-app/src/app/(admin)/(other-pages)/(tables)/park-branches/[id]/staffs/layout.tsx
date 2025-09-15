import { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Park Branch Staffs | ParkMate",
  description:
    "This is Next.js Park Branch Staffs page for ParkMate",
  // other metadata
};

export default function ParkBranchStaffsLayout({ children }: { children: ReactNode }) {
  return (
    <>{children}</>
  );
}