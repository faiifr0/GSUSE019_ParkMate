// src/types/Order.ts

export interface OrderDetail {
  ticketTypeId: number;
  ticketTypeName: string;
  ticketDate: string; // yyyy-MM-dd
  quantity: number;
  price: number;
  discount: number;
  finalPrice: number;
}

export interface Pass {
  passId: number;
  code: string;
  link: string;
  status: string;
}

export interface Order {
  ticketId: number;
  status: string;
  details: OrderDetail[];
  passes: Pass[];
}

// ----- Request types -----

export interface CreateOrderDetailRequest {
  ticketTypeId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  details: CreateOrderDetailRequest[];
  branchId: number;
  ticketDate: string; // yyyy-MM-dd
  customerName: string;
  customerAge: number;
  customerEmail: string;
  customerPhone: string;
  voucherCode?: string;
}

export interface UpdateOrderRequest {
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | string;
  note?: string;
}
