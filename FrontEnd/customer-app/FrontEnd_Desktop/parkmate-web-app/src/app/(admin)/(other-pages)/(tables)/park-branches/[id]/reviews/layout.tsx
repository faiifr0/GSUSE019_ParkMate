import { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Các đánh giá của chi nhánh | ParkMate",
  description:
    "This is Next.js Park Branch Reviews page for ParkMate",
  // other metadata
};

export default function ParkBranchReviewsLayout({ children }: { children: ReactNode }) {
  return (
    <>{children}</>
  );
}