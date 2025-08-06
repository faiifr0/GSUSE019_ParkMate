package park.management.com.vn.exception.promotion;

import park.management.com.vn.exception.ErrorCode;

public class InvalidPromotionBranchException extends PromotionException {

    public InvalidPromotionBranchException(Long promoId) {
        super("Promotion " + promoId + " does not belong to this branch", ErrorCode.PROMOTION_INVALID_BRANCH);
    }
}
