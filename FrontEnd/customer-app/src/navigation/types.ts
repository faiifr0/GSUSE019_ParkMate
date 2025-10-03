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
  TopUp: { walletId: number; amount: number; checkoutUrl: string; orderCode?: number };
  Contact: undefined;
    TicketList: { branchId: number }; // ✅ thêm dòng này
    OrderConfirm: { branchId: number; cart: any[] };
    OrderDetail: { orderId: number }; 
    OrderList: undefined;
  Profile: undefined;
  Promotion: undefined;
  ChatBox: undefined;
  Event: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  QRCodeScanner: undefined;
  PromotionDetail: { promoId: number };
  WalletTopupSuccessScreen: undefined;
  WalletTopupCancelScreen: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  OrderList: undefined;
  Wallet: undefined;
  Profile: undefined;
};
