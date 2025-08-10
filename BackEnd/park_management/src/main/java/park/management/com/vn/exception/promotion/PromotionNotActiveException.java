package park.management.com.vn.exception.promotion;

import park.management.com.vn.exception.ErrorCode;

public class PromotionNotActiveException extends PromotionException {
    public PromotionNotActiveException(Long id) {
        super("Promotion with id: " + id + " is not active at the moment", ErrorCode.PROMOTION_NOT_ACTIVE);
    }
}
