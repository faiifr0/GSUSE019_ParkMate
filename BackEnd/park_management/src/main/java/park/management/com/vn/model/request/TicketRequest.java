package park.management.com.vn.model.request;

import lombok.Data;

import java.util.List;

@Data
public class TicketRequest {

    private Long customerId;

    private Long parkBranchId;

    private List<TicketItemRequest>  ticketItemRequests;

}
