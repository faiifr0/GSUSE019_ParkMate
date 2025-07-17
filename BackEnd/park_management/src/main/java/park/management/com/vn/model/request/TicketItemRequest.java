package park.management.com.vn.model.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TicketItemRequest {

    //Unit price at time of purchase
    private BigDecimal price;
    //How many
    private Integer quantity;
    private Integer discount;

}
