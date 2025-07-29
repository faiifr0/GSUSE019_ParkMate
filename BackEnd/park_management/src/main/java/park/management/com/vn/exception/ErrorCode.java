package park.management.com.vn.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
public enum ErrorCode {

    PRICE_NOT_FOUND("PRICE_NOT_FOUND", HttpStatus.NOT_FOUND),
    USER_NOT_FOUND("CUSTOMER_NOT_FOUND", HttpStatus.NOT_FOUND),
    PARK_BRANCH_NOT_FOUND("PARK_BRANCH_NOT_FOUND", HttpStatus.NOT_FOUND),
    TICKET_NOT_FOUND("TICKET_NOT_FOUND", HttpStatus.NOT_FOUND),
    PROMOTION_NOT_FOUND("PROMOTION_NOT_FOUND", HttpStatus.NOT_FOUND),
    TICKET_STATUS_NOT_VALID("TICKET_STATUS_NOT_VALID", HttpStatus.BAD_REQUEST),;

    private final String code;
    private final HttpStatus status;
}
