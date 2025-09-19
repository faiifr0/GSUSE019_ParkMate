export type RootStackParamList = {
  Home: undefined;
  BranchList: undefined;
  BranchDetail: { branchId: number };
  BranchGameList: { branchId: number };
  GameDetail: { gameId: number };
  MainApp: undefined; // 👈 thêm
  Notifications: undefined;
  NotificationDetail: { notificationId: number };
  Profile: undefined;
  ForgotPassword: undefined;
  Promotion: undefined;
  QRCodeScanner: undefined;
  TicketList: undefined;
  TopUp: {
    walletId: number;
    amount: number;
    checkoutUrl: string; // 👈 thêm dòng này
  };
  Event: undefined;
  ChatBox: undefined;
  Login: undefined;
  Register: undefined;
  Wallet: { userId: number };
  Contact: undefined;
};
