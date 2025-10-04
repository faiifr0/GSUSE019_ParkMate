export interface Event {
  id: number;
  name: string;
  description: string;
  startAt: string;
  endAt: string;
  parkBranchId: number;
  imageUrl?: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}
