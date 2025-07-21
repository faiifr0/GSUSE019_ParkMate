package park.management.com.vn.model.request;

import jakarta.validation.Valid;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
public class TicketRequest {

    private Long customerId;

    private Long parkBranchId;

    private List<TicketItemRequest>  ticketItemRequests;

}
