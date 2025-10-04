export interface TimeObj {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export interface Shift {
  id: number;
  startTime: TimeObj;
  endTime: TimeObj;
  description: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
