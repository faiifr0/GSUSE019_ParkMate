import { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Ảnh của tiện nghi của chi nhánh | ParkMate",
  description:
    "This is Next.js Park Branch Amenitiy's Image page for ParkMate",
  // other metadata
};

export default function AmenityImageLayout({ children }: { children: ReactNode }) {
  return (
    <>{children}</>
  );
}