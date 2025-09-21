import { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Điểm danh ca làm | ParkMate",
  description:
    "This is Next.js Park Branch Take Attendance page for ParkMate",
  // other metadata
};

export default function ShiftTakeAttendanceLayout({ children }: { children: ReactNode }) {
  return (
    <>{children}</>
  );
}