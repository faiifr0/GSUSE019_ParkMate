export type branchTicketTypeCreateModel = {
  name?: string;
  description?: string;
  basePrice?: number;
  isCancelable?: boolean;  
  //status: string; // ### doesn't have this yet
}