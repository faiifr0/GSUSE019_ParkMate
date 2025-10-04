import { Metadata } from 'next';
import Head from 'next/head';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Thông tin chung của chi nhánh | ParkMate",
  description:
    "This is Next.js Park Branch Overview Info page for ParkMate",
  // other metadata  
};

export default function ParkBranchOverviewLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head>
        <script src="https://unpkg.com/trackasia-gl@latest/dist/trackasia-gl.js" />
        <link
          href="https://unpkg.com/trackasia-gl@latest/dist/trackasia-gl.css"
          rel="stylesheet"
        />
      </Head>
      {children}
    </>
  );
}