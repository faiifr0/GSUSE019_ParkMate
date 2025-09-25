// src/navigation/types.ts
export type RootStackParamList = {
  MainApp: undefined;
  Login: undefined;
  Register: undefined;
  Notifications: undefined;
  NotificationDetail: { notificationId: number };
  BranchDetail: { branchId: number };
  GameDetail: { gameId: number };
  Wallet: { userId: number };
  TopUp: { walletId: number; amount: number; checkoutUrl: string };
  Contact: undefined;
  TicketList: undefined;
  Profile: undefined;
  Promotion: undefined;
  ChatBox: undefined;
  Event: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  QRCodeScanner: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  TicketList: undefined;
  QRCodeScanner: undefined;
  Profile: undefined;
};
