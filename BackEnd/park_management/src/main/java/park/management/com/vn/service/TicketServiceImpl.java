package park.management.com.vn.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import park.management.com.vn.entity.Ticket;
import park.management.com.vn.repository.TicketRepository;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

  private final TicketRepository ticketRepository;

  @Override
  public List<Ticket> getAllTickets() {
    return ticketRepository.findAll();
  }

  @Override
  public Optional<Ticket> getTicketById(Long id) {
    return ticketRepository.findById(id);
  }

  @Override
  public Ticket createTicket(Ticket ticket) {
    ticket.setCreatedAt(LocalDateTime.now());
    ticket.setUpdatedAt(LocalDateTime.now());
    return ticketRepository.save(ticket);
  }

  @Override
  public Ticket updateTicket(Long id, Ticket updatedTicket) {
    return ticketRepository.findById(id).map(ticket -> {
      ticket.setParkBranch(updatedTicket.getParkBranch());
      ticket.setUpdatedAt(LocalDateTime.now());
      return ticketRepository.save(ticket);
    }).orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
  }

  @Override
  public void deleteTicket(Long id) {
    ticketRepository.deleteById(id);
  }

  @Override
  public List<Ticket> getTicketsByBranchId(Long branchId) {
    return ticketRepository.findByParkBranchId(branchId);
  }
}
