package park.management.com.vn.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import park.management.com.vn.constaint.TicketStatus;
import park.management.com.vn.entity.*;
import park.management.com.vn.exception.ticket.TicketNotFoundException;
import park.management.com.vn.mapper.TicketMapper;
import park.management.com.vn.model.request.TicketRequest;
import park.management.com.vn.model.response.TicketResponse;
import park.management.com.vn.repository.TicketDetailRepository;
import park.management.com.vn.repository.TicketRepository;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final TicketDetailRepository ticketDetailRepository;

    private final ParkBranchService parkBranchService;
    private final UserService userService;

    private final TicketMapper ticketMapper;


    @Override
    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id).orElseThrow(
                () -> new TicketNotFoundException("Ticket with id: " + id + " does not exist"));
    }

    /*@Override
    public TicketResponse getTicketResponseByID(Long id) {
        Ticket ticket = getTicketById(id);
        List<TicketDetail> ticketDetails = this.getTicketDetailsByTicketId(id);
        return ticketMapper.toResponse(ticket, ticketDetails);
    }*/

    /*@Override
    public List<TicketDetail> getTicketDetailsByTicketId(Long ticketId) {
        return ticketDetailRepository.findByTicket_Id(ticketId);
    }*/

    /*@Override
    public TicketResponse createTicketFromRequest(TicketRequest ticketRequest) {

        //Get customer
        //Customer customer = customerService.getCustomerById(request.getCustomerId());
        Users customer = userService.getUserById(ticketRequest.getCustomerId());

        //Get branch
        //ParkBranch parkBranch = parkBranchService.getBranchById(request.getParkBranchId());

        //Get listed price
        //BigDecimal listedPrice = pricingService.getCurrentTicketPrice();

        //Get promotion for discount
        BranchPromotion promotion = parkBranchService
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

        ticket = ticketRepository.save(ticket);
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
*/
    /*@Override
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
    }*/


}
