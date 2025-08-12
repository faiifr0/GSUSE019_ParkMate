// src/services/ticketService.ts
import axiosClient from '../api/axiosClient';

const ticketService = {
    createTicket: (
        details: { ticketTypeId: number; quantity: number; promotionId?: number }[],
        branchId: number,
        promotionId?: number | null,
        ticketDate?: string
    ) => {
        const payload: any = {
            details,
            branchId,
            ticketDate: ticketDate || new Date().toISOString().split('T')[0],
        };

        if (promotionId !== undefined && promotionId !== null) {
            payload.promotionId = promotionId;
        }

        return axiosClient.post('/api/tickets', payload);
    },

    getTickets: () => axiosClient.get('/api/tickets'),
};

export default ticketService;
