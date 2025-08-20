export interface Notification {
  id: number;
  userId: number;
  message: string;
  notificationType: "EMAIL"; // theo schema hiện tại
  sentAt: string;
  status: "SENT"; // theo schema hiện tại
  createdAt: string;
  updatedAt: string;
}