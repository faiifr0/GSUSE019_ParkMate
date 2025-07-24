package park.management.com.vn.exception.customer;

import park.management.com.vn.exception.BaseException;
import park.management.com.vn.exception.ErrorCode;

public abstract class CustomerException extends BaseException {

    public CustomerException(String message, ErrorCode errorCode) {
        super(message, errorCode);
    }
}
