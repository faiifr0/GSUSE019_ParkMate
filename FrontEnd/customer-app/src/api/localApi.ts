import { tickets, promotions, events } from './mockData';

const localApi = {
    getTickets: () => Promise.resolve({ data: tickets }),

    getTicketDetail: (id: string) => {
        const ticket = tickets.find((item: { id: string }) => item.id === id);
        return Promise.resolve({ data: ticket });
    },

    getPromotions: () => Promise.resolve({ data: promotions }),

    getEvents: () => Promise.resolve({ data: events }),
};
// src/api/localApi.ts
export const login = async (email: string, password: string) => {
    if (email === 'test@gmail.com' && password === '123456') {
        return {
            data: {
                token: 'mock_token_123',
                user: {
                    id: 'u123',
                    name: 'Khách hàng demo',
                    email: 'test@gmail.com',
                },
            },
        };
    } else {
        throw {
            response: {
                data: { message: 'Tài khoản hoặc mật khẩu không đúng' },
            },
        };
    }
};
  
export default localApi;
