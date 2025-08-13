package park.management.com.vn.model.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import park.management.com.vn.entity.DailyTicketInventory;

import java.time.LocalDate;

@Builder
@Data
public class DailyTicketInventoryRequest {

    private Long ticketTypeId;

    @NotNull
    @FutureOrPresent
    private LocalDate date;

    private int capacity;

}
