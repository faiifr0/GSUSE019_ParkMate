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
  Promotion: undefined;
  QRCodeScanner: undefined;
  TicketList: undefined;
  TopUp: undefined;
  Event: undefined;
  ChatBox: undefined;
  Login: undefined;
  Register: undefined;
};
