package park.management.com.vn.exception.promotion;

import park.management.com.vn.exception.ErrorCode;

public class PromotionExpiredException extends PromotionException {
    public PromotionExpiredException(Long id) {

        super("Promotion with id: " + id + " is expired", ErrorCode.PROMOTION_EXPIRED);
    }
}
