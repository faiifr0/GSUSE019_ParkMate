import { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Các tiện nghi của chi nhánh | ParkMate",
  description:
    "This is Next.js Park Branch Amenities page for ParkMate",
  // other metadata
};

export default function ParkBranchAmenitiesLayout({ children }: { children: ReactNode }) {
  return (
    <>{children}</>
  );
}