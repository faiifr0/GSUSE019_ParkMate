import { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Notifications | ParkMate",
  description:
    "This is Next.js Notification page for ParkMate",
  // other metadata
};

export default function NotificationsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}