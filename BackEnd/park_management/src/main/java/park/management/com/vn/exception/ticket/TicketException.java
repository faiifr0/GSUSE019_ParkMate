package park.management.com.vn.exception.ticket;

import park.management.com.vn.exception.BaseException;
import park.management.com.vn.exception.ErrorCode;

public abstract class TicketException extends BaseException {
  public TicketException(String message, ErrorCode errorCode) {
    super(message, errorCode);
  }

}
