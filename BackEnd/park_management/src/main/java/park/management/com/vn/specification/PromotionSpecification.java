package park.management.com.vn.specification;

import org.springframework.data.jpa.domain.Specification;
import park.management.com.vn.entity.Promotion;

import java.time.LocalDateTime;

public class PromotionSpecification {

    public static Specification<Promotion> validAtBranch(Long branchId, LocalDateTime atTime) {

        return (root, criteriaQuery, cb) ->
                cb.and(
                        cb.equal(root.get("branch").get("id"), branchId),
                        cb.equal(root.get("isActive"), 1),
                        cb.lessThanOrEqualTo(root.get("from"), atTime),
                        cb.greaterThanOrEqualTo(root.get("to"), atTime)
                );
    }

}
