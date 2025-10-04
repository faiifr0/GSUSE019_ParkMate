import { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Vouchers của chi nhánh | ParkMate",
  description:
    "This is Next.js Park Branch Vouchers page for ParkMate",
  // other metadata
};

export default function ParkBranchVouchersLayout({ children }: { children: ReactNode }) {
  return (
    <>{children}</>
  );
}