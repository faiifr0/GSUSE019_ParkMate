export interface OrderDetail {
  ticketTypeId: number;
  ticketTypeName: string;
  ticketDate: string; // yyyy-MM-dd
  quantity: number;
  price: number;
  discount: number;
  finalPrice: number;
}

export interface OrderPass {
  passId: number;
  code: string;
  link: string;
  status: string;
}

export interface Order {
  orderId: number;
  status: string;
  finalAmount: number;
  details: OrderDetail[];
  passes: OrderPass[];
}

export interface CreateOrderPayload {
  details: {
    ticketTypeId: number;
    quantity: number;
  }[];
  branchId: number;
  ticketDate: string; // yyyy-MM-dd
  customerName: string;
  customerAge: number;
  customerEmail: string;
  customerPhone: string;
  voucherCode?: string;
}

export interface UpdateOrderPayload {
  status: string; // "PENDING" | "CONFIRMED" | ...
  note?: string;
}
