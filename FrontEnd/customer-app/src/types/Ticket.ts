// src/types/Ticket.ts
export interface Ticket {
  id: number;
  name: string;
  description: string;
  basePrice: number;     // đúng với BE
  parkBranchId: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}
