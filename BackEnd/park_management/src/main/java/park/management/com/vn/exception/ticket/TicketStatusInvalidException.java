package park.management.com.vn.exception.ticket;

import park.management.com.vn.exception.ErrorCode;

public class TicketStatusInvalidException extends TicketException {
    public TicketStatusInvalidException(String message) {
        super(message, ErrorCode.TICKET_STATUS_NOT_VALID);
    }
}
