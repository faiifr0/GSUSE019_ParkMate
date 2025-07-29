package park.management.com.vn.service;

import java.util.List;
import java.util.Optional;
import park.management.com.vn.entity.Ticket;
import park.management.com.vn.model.response.TicketResponse;

public interface TicketService {

    Ticket getTicketById(Long id);

    //TicketResponse getTicketResponseByID(Long id);
}
