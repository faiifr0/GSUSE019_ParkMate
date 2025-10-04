import { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Các trò chơi của chi nhánh | ParkMate",
  description:
    "This is Next.js Park Branch Games page for ParkMate",
  // other metadata
};

export default function ParkBranchGamesLayout({ children }: { children: ReactNode }) {
  return (
    <>{children}</>
  );
}