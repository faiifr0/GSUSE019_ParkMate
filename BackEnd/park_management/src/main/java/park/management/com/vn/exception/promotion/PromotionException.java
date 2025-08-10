package park.management.com.vn.exception.promotion;

import park.management.com.vn.exception.BaseException;
import park.management.com.vn.exception.ErrorCode;

public abstract class PromotionException extends BaseException {
    public PromotionException(String message, ErrorCode errorCode) {
        super(message, errorCode);
    }
}
