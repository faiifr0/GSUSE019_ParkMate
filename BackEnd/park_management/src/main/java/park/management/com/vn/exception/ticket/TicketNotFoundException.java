package park.management.com.vn.exception.ticket;

import park.management.com.vn.exception.ErrorCode;

public class TicketNotFoundException extends TicketException {
  public TicketNotFoundException(String message) {
    super(message, ErrorCode.TICKET_NOT_FOUND);
  }
}
