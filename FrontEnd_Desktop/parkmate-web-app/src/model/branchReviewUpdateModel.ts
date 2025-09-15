export type branchReviewUpdateModel = {
  userId: number;    
  branchId: number;   
  rating: number;       // 1 to 5
  comment?: string;     // optional, max length 1000
  approved: boolean;    
}