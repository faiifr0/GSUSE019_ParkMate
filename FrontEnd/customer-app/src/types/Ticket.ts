export interface Ticket {
  id: number;
  name: string;
  description: string;
  price: number;        // map từ basePrice của backend
  parkBranchId: number; // id chi nhánh
  status: boolean;
  createdAt: string;
  updatedAt: string;
}