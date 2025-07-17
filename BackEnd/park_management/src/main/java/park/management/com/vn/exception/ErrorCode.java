package park.management.com.vn.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
public enum ErrorCode {

    PRICE_NOT_FOUND("PRICE_NOT_FOUND", HttpStatus.NOT_FOUND),
    CUSTOMER_NOT_FOUND("CUSTOMER_NOT_FOUND", HttpStatus.NOT_FOUND),
    PARK_BRANCH_NOT_FOUND("PARK_BRANCH_NOT_FOUND", HttpStatus.NOT_FOUND);

    private final String code;
    private final HttpStatus status;
}
