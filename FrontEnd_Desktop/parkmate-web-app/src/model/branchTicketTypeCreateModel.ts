export type branchTicketTypeCreateModel = {
  name?: string;
  description?: string;
  basePrice?: number;
  isCancelable?: boolean;
  startTime?: string;
  endTime?: string;
  //status: string; // doesn't have this yet
}