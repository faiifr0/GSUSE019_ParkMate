const ticketService = {
  getTickets: async () => {
    // Giả lập API delay 1 giây
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            { id: 1, name: 'Vé tháng', price: 500000, description: 'Sử dụng trong 30 ngày' },
            { id: 2, name: 'Vé ngày', price: 30000, description: 'Sử dụng trong 24h' },
          ],
        });
      }, 1000);
    });
  },
};

export default ticketService;