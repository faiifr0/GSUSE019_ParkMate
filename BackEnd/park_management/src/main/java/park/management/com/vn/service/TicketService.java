package park.management.com.vn.service;

import park.management.com.vn.entity.Ticket;
import park.management.com.vn.entity.TicketDetail;
import park.management.com.vn.model.request.TicketRequest;
import park.management.com.vn.model.response.TicketResponse;

import java.util.List;
import java.util.Optional;

public interface TicketService {

    List<Ticket> getAllTickets();

    Ticket getTicketById(Long id);

    TicketResponse getTicketResponseByID(Long id);

    Optional<Ticket> findTicketById(Long id);

    Ticket createTicket(Ticket ticket);

    Ticket updateTicket(Long id, Ticket ticket);

    void deleteTicket(Long id);

    List<Ticket> getTicketsByBranchId(Long branchId);

    List<TicketDetail> getTicketDetailsByTicketId(Long ticketId);

    //tungnd
    TicketResponse createTicketFromRequest(TicketRequest request);

    TicketResponse approveTicket(Long id);
}
