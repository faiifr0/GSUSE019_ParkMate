package park.management.com.vn.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import park.management.com.vn.constaint.TicketStatus;
import park.management.com.vn.entity.*;
import park.management.com.vn.exception.customer.CustomerNotFoundException;
import park.management.com.vn.exception.ticket.TicketNotFoundException;
import park.management.com.vn.exception.ticket.TicketStatusInvalidException;
import park.management.com.vn.mapper.TicketMapper;
import park.management.com.vn.model.request.TicketRequest;
import park.management.com.vn.model.response.TicketResponse;
import park.management.com.vn.repository.ParkBranchRepository;
import park.management.com.vn.repository.TicketDetailRepository;
import park.management.com.vn.repository.TicketRepository;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final CustomerService customerService;
    private final ParkBranchService parkBranchService;
    private final PricingService pricingService;
    private final PromotionService promotionService;
    private final TicketRepository ticketRepository;
    private final TicketDetailRepository ticketDetailRepository;
    private final TicketMapper ticketMapper;


    @Override
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    @Override
    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id).orElseThrow(
                () -> new TicketNotFoundException("Ticket with id: " + id + " does not exist"));
    }

    @Override
    public TicketResponse getTicketResponseByID(Long id) {
        Ticket ticket = getTicketById(id);
        List<TicketDetail> ticketDetails = this.getTicketDetailsByTicketId(id);
        return ticketMapper.toResponse(ticket, ticketDetails);
    }

    @Override
    public Optional<Ticket> findTicketById(Long id) {
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
    public List<TicketDetail> getTicketDetailsByTicketId(Long ticketId) {
        return ticketDetailRepository.findByTicket_Id(ticketId);
    }

    @Override
    public TicketResponse createTicketFromRequest(TicketRequest request) {

        //Get customer
        Customer customer = customerService.getCustomerById(request.getCustomerId());

        //Get branch
        ParkBranch parkBranch = parkBranchService.getBranchById(request.getParkBranchId());

        //Get listed price
        BigDecimal listedPrice = pricingService.getCurrentTicketPrice();

        //Get promotion for discount
        Promotion promotion = promotionService
                .findValidPromotionForBranch(parkBranch.getId(), LocalDateTime.now())
                .orElse(null);

        //Extract discount from promotion
        BigDecimal discount = promotionService.getDiscountFromPromotion(promotion);

        // 1. create ticket
        Ticket ticket = Ticket.builder()
                .customer(customer)
                .parkBranch(parkBranch)
                .status(TicketStatus.REQUEST_TIME)
                .build();

        ticket =  ticketRepository.save(ticket);
        final Ticket savedTicket = ticket;

        // 2. create ticket details
        List<TicketDetail> ticketDetails = request.getTicketItemRequests().stream()
                .map(item -> TicketDetail.builder()
                        .ticket(savedTicket)
                        .price(listedPrice)
                        .quantity(item.getQuantity())
                        .discount(discount)
                        .build())
                .toList();

        ticketDetailRepository.saveAll(ticketDetails);

        //3. response
        return ticketMapper.toResponse(ticket, ticketDetails);

    }

    @Override
    public TicketResponse approveTicket(Long id) {
        // Validate the ticket
        Ticket ticket = this.getTicketById(id);

        if (ticket.getStatus() != TicketStatus.REQUEST_TIME)
            throw new TicketStatusInvalidException("Only tickets in REQUEST_TIME status can be approved.");

        // Validation done, now update the ticket
        ticket.setStatus(TicketStatus.APPROVED);
        ticket.setUpdatedAt(LocalDateTime.now());

        final Ticket updatedTicket = ticketRepository.save(ticket);

        List<TicketDetail> ticketDetails =
                this.getTicketDetailsByTicketId(updatedTicket.getId());

        // build response and return
        return ticketMapper.toResponse(updatedTicket,ticketDetails);
    }
}
