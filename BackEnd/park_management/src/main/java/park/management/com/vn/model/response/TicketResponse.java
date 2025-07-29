package park.management.com.vn.model.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@Data
public class TicketResponse {
    private Long ticketId;
    private String status;
    private List<TicketDetailResponse> details;

}

