package park.management.com.vn.exception.ticket;
import park.management.com.vn.exception.ErrorCode;


public class TicketTypeNotFoundException extends TicketException {
    public TicketTypeNotFoundException(Long id) {
        super("Ticket not found with id " + id, ErrorCode.TICKET_TYPE_NOT_FOUND);
    }
}
