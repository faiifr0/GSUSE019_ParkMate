// src/types/branch.ts
export interface Branch {
  id: number;
  name: string;
  lat: number;
  lon: number;
  address?: string;
  open?: string;
  close?: string;
}

// Dữ liệu raw từ API
export interface BranchRaw extends Omit<Branch, "lat" | "lon" | "open" | "close"> {
  location: string; // "lat,lon"
  open?: string;    // ISO datetime
  close?: string;
}
