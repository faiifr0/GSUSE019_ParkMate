package park.management.com.vn.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import park.management.com.vn.entity.Ticket;
import park.management.com.vn.repository.TicketRepository;
import org.springframework.stereotype.Service;

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
            ticket.setTicketType(updatedTicket.getTicketType());
            ticket.setPrice(updatedTicket.getPrice());
            ticket.setParkBranch(updatedTicket.getParkBranch());
            ticket.setEvent(updatedTicket.getEvent());
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

    @Override
    public List<Ticket> getTicketsByEventId(Long eventId) {
        return ticketRepository.findByEventId(eventId);
    }
}
