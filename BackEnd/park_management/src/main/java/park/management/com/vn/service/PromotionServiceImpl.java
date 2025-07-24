package park.management.com.vn.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import park.management.com.vn.entity.Promotion;
import park.management.com.vn.exception.price.PriceNotFoundException;
import park.management.com.vn.repository.PromotionRepository;
import park.management.com.vn.specification.PromotionSpecification;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PromotionServiceImpl implements PromotionService {

    private final PromotionRepository promotionRepository;

    @Override
    public Promotion getPromotionById(Long id) {
        return promotionRepository.findById(id).orElseThrow(
                () -> new PriceNotFoundException("Promotion not found"));
    }

    @Override
    public Promotion findPromotionById(Long id) {
        return promotionRepository.findById(id).orElse(null);
    }

    @Override
    public Optional<Promotion> findValidPromotionForBranch(Long branchId, LocalDateTime atTime) {
        return promotionRepository
                .findOne(PromotionSpecification.validAtBranch(branchId, atTime));
    }

    @Override
    public BigDecimal getDiscountFromPromotion(Promotion promotion) {
        return promotion != null ? promotion.getDiscount() : BigDecimal.ZERO;
    }
}
