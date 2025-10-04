package park.management.com.vn.model.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter
@Getter
public class VoucherResponse {

    private Long id;

    private Long parkBranchId;

    private String code;

    private BigDecimal percent;

    private BigDecimal maxDiscount;

    private LocalDateTime startAt;

    private LocalDateTime endAt;

    private Boolean active;
    
}

