// Danh sách vé giả
export const tickets = [
    { id: '1', name: 'Vé Trọn Gói', price: 200000, description: 'Vé vào cổng + tất cả trò chơi.' },
    { id: '2', name: 'Vé Trẻ Em', price: 100000, description: 'Vé dành cho trẻ em dưới 1m2.' },
    { id: '3', name: 'Vé Người Lớn', price: 150000, description: 'Vé dành cho người lớn.' },
];

// Danh sách khuyến mãi giả
export const promotions = [
    { id: 'p1', title: 'Giảm 20% khi mua 2 vé', detail: 'Áp dụng từ 01/07 - 10/07.' },
    { id: 'p2', title: 'Tặng quà cho hóa đơn trên 500k', detail: 'Số lượng có hạn.' },
];

// Danh sách sự kiện giả
export const events = [
    { id: 'e1', title: 'Lễ Hội Mùa Hè', date: '2025-07-10' },
    { id: 'e2', title: 'Đêm Hội Trăng Rằm', date: '2025-08-15' },
];
// api/mockData.ts
export type Branch = {
  id: string;
  name: string;
  distance: number;
  games: string[];
  lat: number; // thêm
  lon: number; // thêm
};

export const branches: Branch[] = [
  {
    id: "1",
    name: "Chi nhánh Hà Nội",
    distance: 0,
    games: ["Tàu lượn siêu tốc", "Hồ bơi"],
    lat: 21.028511,
    lon: 105.804817,
  },
  {
    id: "2",
    name: "Chi nhánh TP. Hồ Chí Minh",
    distance: 0,
    games: ["Trượt nước", "Nhà ma"],
    lat: 10.762622,
    lon: 106.660172,
  },
];
