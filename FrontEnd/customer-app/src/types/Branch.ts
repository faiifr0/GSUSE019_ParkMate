// Branch đã format cho frontend
export interface Branch {
  id: number;
  name: string;
  address?: string;
  lat: number;
  lon: number;
  open?: string;   // "HH:mm"
  close?: string;  // "HH:mm"
  status?: boolean;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Dữ liệu raw từ API
export interface BranchRaw {
  id: number;
  name: string;
  address?: string;
  location?: string; // "lat,lon"
  openTime?: {
    hour: number;
    minute: number;
    second?: number;
    nano?: number;
  };
  closeTime?: {
    hour: number;
    minute: number;
    second?: number;
    nano?: number;
  };
  status?: boolean;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
