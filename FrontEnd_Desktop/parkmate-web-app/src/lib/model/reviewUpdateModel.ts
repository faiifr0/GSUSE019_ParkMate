export type reviewUpdateModel = {
  userId?: string;
  branchId?: string;
  rating?: number;
  comment?: string;
  approved?: boolean;
}