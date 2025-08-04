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
    return new Promise<{ data: { token: string; user: any } }>((resolve, reject) => {
        setTimeout(() => {
            if (email === 'user@example.com' && password === '123456') {
                resolve({
                    data: {
                        token: 'demo-token',
                        user: { name: 'Người dùng demo', email },
                    },
                });
            } else {
                reject({ response: { data: { message: 'Invalid credentials' } } });
            }
        }, 1000);
    });
};

  
export default localApi;
