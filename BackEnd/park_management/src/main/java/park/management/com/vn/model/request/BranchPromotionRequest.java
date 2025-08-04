package park.management.com.vn.model.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
@Setter
@Getter
public class BranchPromotionRequest {
    private Long parkBranchId;
    private String description;
    private BigDecimal discount;
    private LocalDateTime from;
    private LocalDateTime to;
    private Long isActive;
}
