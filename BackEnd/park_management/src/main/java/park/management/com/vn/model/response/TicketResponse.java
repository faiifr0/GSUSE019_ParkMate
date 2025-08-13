package park.management.com.vn.model.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@Data
public class TicketResponse {
    private Long ticketId;
    private String status;
    private BigDecimal totalAmount;
    private BigDecimal finalAmount;
    private LocalDate ticketDate;
    private Long branchId;
    private Long branchPromotionId;
    //ticketDate, branchId, totalAmount, finalAmount, promotionId
    private List<TicketDetailResponse> details;

}

