export interface Game {
  id: number;
  branchId: number;
  name: string;
  description: string;
  location: string; // có thể chứa tầng, vị trí hoặc lat,long
  thumbnail?: string;
}
