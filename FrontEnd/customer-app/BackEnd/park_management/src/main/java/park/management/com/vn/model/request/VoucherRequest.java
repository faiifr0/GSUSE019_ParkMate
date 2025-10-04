package park.management.com.vn.model.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
@Setter
@Getter

public class VoucherRequest {

    @NotNull(message = "Không được để trống chi nhánh mà voucher thuộc về")
    private Long parkBranchId;

    @NotBlank(message = "Mã voucher không được để trống")
    private String code;

    @NotNull(message = "Giảm giá voucher không được null")
    @DecimalMin(value = "0.0", message = "Giảm giá voucher phải ít nhất 0%")
    @DecimalMax(value = "0.5", message = "Giảm giá voucher không được vượt quá 50%")
    private BigDecimal percent;

    @DecimalMax(value = "500000", message = "Giảm giá của voucher không được vượt quá 500000 VND")
    @NotNull
    private BigDecimal maxDiscount;

    @NotNull
    private LocalDateTime startAt;

    @NotNull
    private LocalDateTime endAt;

    @NotNull
    private Boolean active;
    
}
