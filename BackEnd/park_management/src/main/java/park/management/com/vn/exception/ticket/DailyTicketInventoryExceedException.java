package park.management.com.vn.exception.ticket;

import park.management.com.vn.exception.ErrorCode;

import java.time.LocalDate;

public class DailyTicketInventoryExceedException extends TicketException {
    public DailyTicketInventoryExceedException(LocalDate ticketDate) {
        super("Daily ticket inventory quantity for date: " + ticketDate + " has been sold out",
                ErrorCode.TICKET_INVENTORY_EXCEED);
    }
}
