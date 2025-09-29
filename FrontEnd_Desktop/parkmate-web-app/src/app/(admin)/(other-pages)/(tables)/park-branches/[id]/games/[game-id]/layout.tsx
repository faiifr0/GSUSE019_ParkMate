import { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Ảnh của trò chơi của chi nhánh | ParkMate",
  description:
    "This is Next.js Park Branch Game's Image page for ParkMate",
  // other metadata
};

export default function GameImageLayout({ children }: { children: ReactNode }) {
  return (
    <>{children}</>
  );
}