package park.management.com.vn.exception.price;

import park.management.com.vn.exception.BaseException;
import park.management.com.vn.exception.ErrorCode;

public abstract class PriceException extends BaseException {
    public PriceException(String message, ErrorCode errorCode) {
        super(message, errorCode);
    }
}
