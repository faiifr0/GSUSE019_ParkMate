package park.management.com.vn.exception.promotion;

import park.management.com.vn.exception.ErrorCode;

public class PromotionNotFoundException extends PromotionException {
    public PromotionNotFoundException(String message) {
        super(message, ErrorCode.PROMOTION_NOT_FOUND);
    }

}
