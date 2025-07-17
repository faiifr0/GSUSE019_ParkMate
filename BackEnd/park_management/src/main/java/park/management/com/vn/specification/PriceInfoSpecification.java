package park.management.com.vn.specification;

import org.springframework.data.jpa.domain.Specification;
import park.management.com.vn.constaint.PriceInfoConstant;
import park.management.com.vn.entity.PriceInfo;

import java.time.LocalDateTime;

public class PriceInfoSpecification {

    public static Specification<PriceInfo> isCurrentTicketPrice() {
        LocalDateTime now = LocalDateTime.now();

        return ((root, query, criteriaBuilder)
                -> criteriaBuilder.and(
                criteriaBuilder.equal(root.get("priceInfoConstant"), PriceInfoConstant.TICKET),
                criteriaBuilder.lessThanOrEqualTo(root.get("fromDate"), now),
                criteriaBuilder.greaterThanOrEqualTo(root.get("toDate"), now)
        ));
    }

    public static Specification<PriceInfo> isCurrentTicketAmenity() {
        LocalDateTime now = LocalDateTime.now();
        return ((root, query, criteriaBuilder)
                -> criteriaBuilder.and(
                criteriaBuilder.equal(root.get("priceInfoConstant"), PriceInfoConstant.AMENITY),
                criteriaBuilder.lessThanOrEqualTo(root.get("fromDate"), now),
                criteriaBuilder.greaterThanOrEqualTo(root.get("toDate"), now)
        ));
    }


}
