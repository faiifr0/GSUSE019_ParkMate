package park.management.com.vn.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyTicketInventoryResponse {

    private Long id;            // from BaseEntity
    private Long ticketTypeId;  // ticketType.getId()
    private String ticketTypeName; // optional, from ticketType.getName() if needed
    private LocalDate date;
    private Integer capacity;
    private Integer sold;
    private Long version;
}

