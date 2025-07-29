package park.management.com.vn.service;

import java.time.LocalDate;
import java.util.Optional;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import park.management.com.vn.entity.*;
import park.management.com.vn.exception.promotion.PromotionExpiredException;
import park.management.com.vn.exception.promotion.PromotionNotActiveException;
import park.management.com.vn.exception.ticket.DailyTicketInventoryExceedException;
import park.management.com.vn.exception.ticket.DailyTicketInventoryNotFoundException;
import park.management.com.vn.exception.ticket.TicketNotFoundException;
import park.management.com.vn.exception.ticket.TicketTypeNotFoundException;
import park.management.com.vn.mapper.TicketMapper;
import park.management.com.vn.model.request.TicketRequest;
import park.management.com.vn.model.response.TicketResponse;
import park.management.com.vn.repository.DailyTicketInventoryRepository;
import park.management.com.vn.repository.TicketDetailRepository;
import park.management.com.vn.repository.TicketRepository;
import park.management.com.vn.repository.TicketTypeRepository;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final TicketDetailRepository ticketDetailRepository;
    private final DailyTicketInventoryRepository dailyTicketInventoryRepository;

    private final ParkBranchService parkBranchService;
    private final UserService userService;

    private final TicketMapper ticketMapper;


    @Override
    public TicketOrder getTicketOrderById(Long id) {
        return ticketRepository.findById(id).orElseThrow(
                () -> new TicketNotFoundException("Ticket with id: " + id + " does not exist"));
    }

    @Override
    public Optional<TicketOrder> findTicketOrderById(Long id) {
        return ticketRepository.findById(id);
    }

    @Override
    public Optional<TicketType> findTicketTypeById(Long id) {
        return ticketTypeRepository.findById(id);
    }

    @Override
    public TicketType getTicketTypeById(Long id) {
        return this.findTicketTypeById(id)
                .orElseThrow(() -> new TicketTypeNotFoundException(id));
    }

    @Override
    public DailyTicketInventory getDailyTicketInventory
            (Long ticketTypeId, LocalDate ticketDate) {
        return dailyTicketInventoryRepository.getDailyTicketInventoriesByTicketType_IdAndDate(ticketTypeId, ticketDate)
                .orElseThrow(() -> new DailyTicketInventoryNotFoundException(ticketTypeId, ticketDate));
    }



    /*@Override
    public TicketResponse getTicketResponseByID(Long id) {
        Ticket ticket = getTicketById(id);
        List<TicketDetail> ticketDetails = this.(id);
        return ticketMapper.toResponse(ticket, ticketDetails);
    }
*/
    /*@Override
    public List<TicketDetail> getTicketDetailsByTicketId(Long ticketId) {
        return ticketDetailRepository.findByTicket_Id(ticketId);
    }*/

    @Override
    public TicketResponse createTicketOrder(TicketRequest ticketRequest, Long userId) {

        //Get customer
        //Customer customer = customerService.getCustomerById(request.getCustomerId());
        Users customer = userService.getUserById(userId);

        //TODO logic to handle ticket purchase

        for (TicketRequest.TicketDetailRequest detailRequest : ticketRequest.getDetails()) {
            /*1. Validate each ticket detail
            Check if each ticketTypeId exists
            Check ticketDate is valid (not in the past)
            Optional: Validate promotionId (exists, valid for ticket type)
            */
            LocalDate ticketDate = detailRequest.getTicketDate();

            TicketType ticketType = this.getTicketTypeById(detailRequest.getTicketTypeId());

            Optional<BranchPromotion> promotion = parkBranchService
                    .findBranchPromotionById(detailRequest.getPromotionId());

            if (promotion.isPresent()) {
                BranchPromotion promo = promotion.get();
                if (!Boolean.TRUE.equals(promotion.get().getIsActive())) {
                    throw new PromotionNotActiveException(promo.getId());
                }

                if (ticketDate.isBefore(promo.getValidFrom().toLocalDate()) ||
                        ticketDate.isAfter(promo.getValidUntil().toLocalDate())) {
                    throw new PromotionExpiredException(promo.getId());
                }
            }
            /*
             2. Validate Inventory for (ticketType, ticketDate)
            Check if the system allows selling that quantity on the given day.
            You’ll want to:
            Query DailyTicketInventory for (ticketType.id, ticketDate)
            If not found → create one with default totalAvailable = 100 (or whatever you define)
            Check if:
            inventory.getSold() + quantity > inventory.getTotalAvailable()
            → throw TicketInventoryExceededException
             */

            // Find the inventory for the ordering day of the ticket
            DailyTicketInventory dailyTicketInventory = this
                    .getDailyTicketInventory(ticketType.getId(), ticketDate);

            //Validate quantity available

            if (dailyTicketInventory.getSold() + detailRequest.getQuantity()
                    > dailyTicketInventory.getTotalAvailable())
                throw new DailyTicketInventoryExceedException(ticketDate); // there is a problem here, we only check per ticket detail, but not the whole ticket detail list


        }


        //return ticketMapper.toResponse(ticketOrder, ticketDetails);
        return null;

    }

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
