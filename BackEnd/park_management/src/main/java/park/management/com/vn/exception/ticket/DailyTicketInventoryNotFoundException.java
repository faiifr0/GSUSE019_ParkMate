package park.management.com.vn.exception.ticket;

import park.management.com.vn.exception.ErrorCode;

import java.time.LocalDate;

public class DailyTicketInventoryNotFoundException extends TicketException {
    public DailyTicketInventoryNotFoundException(Long ticketTypeId, LocalDate ticketDate) {
        super("Daily Inventory not found for Ticket Type with id: " + ticketTypeId
                        + " and Date: " + ticketDate,
                ErrorCode.TICKET_INVENTORY_NOT_FOUND);
    }
}
