package park.management.com.vn.model.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TicketDetailsResponse {

    // Echoed from DB
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal discount; // updated from Integer

}
