package park.management.com.vn.service;

import park.management.com.vn.entity.Promotion;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

public interface PromotionService {

    Promotion getPromotionById(Long id);
    Promotion findPromotionById(Long id);
    Optional<Promotion> findValidPromotionForBranch(Long branchId, LocalDateTime atTime);
    BigDecimal getDiscountFromPromotion(Promotion promotion);

}
