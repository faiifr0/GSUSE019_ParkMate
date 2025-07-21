package park.management.com.vn.model.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TicketItemRequest {

    //How many
    private Integer quantity;

    //ticket type (e.g., ADULT, CHILD, SENIOR) — for future support
    private String ticketType; // TODO: Implement logic when category support is approved

}
