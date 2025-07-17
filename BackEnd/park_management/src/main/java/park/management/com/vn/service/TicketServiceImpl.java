package park.management.com.vn.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import park.management.com.vn.entity.Customer;
import park.management.com.vn.entity.ParkBranch;
import park.management.com.vn.entity.Ticket;
import park.management.com.vn.exception.customer.CustomerNotFoundException;
import park.management.com.vn.model.request.TicketRequest;
import park.management.com.vn.model.response.TicketResponse;
import park.management.com.vn.repository.ParkBranchRepository;
import park.management.com.vn.repository.TicketRepository;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final CustomerService customerService;

    private final ParkBranchService parkBranchService;

    private final PricingService pricingService;

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

    @Override
    public TicketResponse createTicketFromRequest(TicketRequest request) {

        //Get customer
        Customer customer = customerService.getCustomerById(request.getCustomerId());

        //Get branch
        ParkBranch parkBranch = parkBranchService.getBranchById(request.getParkBranchId());

        BigDecimal listedPrice = pricingService.getCurrentTicketPrice();


        /*
        TicketDetails
        @ManyToOne
        @JoinColumn(name = "ticket_id")
        private Ticket ticket;

        @Column(name = "quantity")
        private Integer quantity;

        @Column(name = "price")
        private BigDecimal price;

        private Integer discount;

        Ticket:
        @ManyToOne(fetch = FetchType.LAZY)
        private Customer customer;

        @ManyToOne
        @JoinColumn(name = "park_branch_id")
        private ParkBranch parkBranch;

        @Enumerated(EnumType.STRING)
        private TicketStatus status;
        */

        //TODO: service for promotion and then getDiscount from promotion

        return null;

    }
}
