package park.management.com.vn.model.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

// NEW: import the pass-link DTO
// (Create class: park.management.com.vn.model.response.TicketPassLink)
@NoArgsConstructor
@Data
public class TicketResponse {
  private Long orderId;
  private BigDecimal finalAmount;
  private String status;
  private LocalDateTime createdAt;
  private List<TicketDetailResponse> details;

  // NEW: list of QR links (one per unit)
  private List<TicketPassLink> passes;
}
