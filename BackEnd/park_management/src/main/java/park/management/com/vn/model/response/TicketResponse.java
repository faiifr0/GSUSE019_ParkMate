package park.management.com.vn.model.response;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@Data
public class TicketResponse {

    //ID of the saved ticket
    private Long ticketId;
    //Typically REQUEST_TIME or APPROVED
    private String status;
    //Echoes saved item details
    private List<TicketDetailsResponse> details;

}
