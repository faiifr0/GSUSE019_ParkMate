import { tickets, promotions, events } from './mockData';

const localApi = {
    getTickets: () => Promise.resolve({ data: tickets }),

    getTicketDetail: (id: string) => {
        const ticket = tickets.find((item) => item.id === id);
        return Promise.resolve({ data: ticket });
    },

    getPromotions: () => Promise.resolve({ data: promotions }),

    getEvents: () => Promise.resolve({ data: events }),
};

export default localApi;
