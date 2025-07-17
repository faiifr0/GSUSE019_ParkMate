package park.management.com.vn.service;

import java.util.List;
import java.util.Optional;
import park.management.com.vn.entity.Ticket;
import park.management.com.vn.model.request.TicketRequest;
import park.management.com.vn.model.response.TicketResponse;

public interface TicketService {

  List<Ticket> getAllTickets();

  Optional<Ticket> getTicketById(Long id);

  Ticket createTicket(Ticket ticket);

  Ticket updateTicket(Long id, Ticket ticket);

  void deleteTicket(Long id);

  List<Ticket> getTicketsByBranchId(Long branchId);

  //tungnd
  TicketResponse createTicketFromRequest(TicketRequest request);
}
