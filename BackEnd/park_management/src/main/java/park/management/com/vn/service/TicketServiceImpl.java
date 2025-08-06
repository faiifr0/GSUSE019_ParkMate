package park.management.com.vn.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import lombok.RequiredArgsConstructor;
import org.springframework.data.util.Pair;
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
import park.management.com.vn.repository.*;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final TicketDetailRepository ticketDetailRepository;
    private final DailyTicketInventoryRepository dailyTicketInventoryRepository;
    private final BulkPricingRuleRepository bulkPricingRuleRepository;

    private final ParkBranchService parkBranchService;
    private final BranchPromotionService branchPromotionService;
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

        //Prepare a map to check inventory available quantity for each detail request
        Map<Pair<Long, LocalDate>, Integer> remainingCapacityMap = new HashMap<>();
        //This map is for pricing
        Map<TicketType, Integer> ticketTypeQuantityMap = new HashMap<>();
        //
        Map<TicketType, BigDecimal> ticketTypePriceMap = new HashMap<>();

        for (TicketRequest.TicketDetailRequest detailRequest : ticketRequest.getDetails()) {
            //🔹#1. Validate each ticket detail
            LocalDate ticketDate = detailRequest.getTicketDate();

            TicketType ticketType = this.getTicketTypeById(detailRequest.getTicketTypeId());

            Integer quantityRequested = detailRequest.getQuantity();

            Optional<BranchPromotion> promotion = branchPromotionService
                    .findBranchPromotionById(detailRequest.getPromotionId());

            if (promotion.isPresent()) {
                BranchPromotion promo = promotion.get();
                if (!Boolean.TRUE.equals(promotion.get().getIsActive()))
                    throw new PromotionNotActiveException(promo.getId());


                if (ticketDate.isBefore(promo.getValidFrom().toLocalDate()) ||
                        ticketDate.isAfter(promo.getValidUntil().toLocalDate()))
                    throw new PromotionExpiredException(promo.getId());
            }

            //🔹#2. Validate Inventory for (ticketType, ticketDate)
            DailyTicketInventory inventory = this.getDailyTicketInventory(ticketType.getId(), ticketDate);
            Pair<Long, LocalDate> typeAndLocalDateKeyPair = Pair.of(ticketType.getId(), ticketDate);

            //if key for referring is not present
            remainingCapacityMap.putIfAbsent(
                    typeAndLocalDateKeyPair,
                    inventory.getTotalAvailable() - quantityRequested
            );

            int available = remainingCapacityMap.get(typeAndLocalDateKeyPair);

            if (quantityRequested > available)
                throw new DailyTicketInventoryExceedException(ticketDate);

            //either way, put key and value to the map
            remainingCapacityMap.put(typeAndLocalDateKeyPair, available - quantityRequested);

            ticketTypeQuantityMap.put(
                    ticketType,
                    ticketTypeQuantityMap.getOrDefault(ticketType, 0) + quantityRequested
            );


        } // end loop

        //🔹 #3. Calculate price per line
        //iterate the hashmap ticketTypeQuantityMap
        for (Map.Entry<TicketType, Integer> entry : ticketTypeQuantityMap.entrySet()) {
            TicketType ticketType = entry.getKey();
            BigDecimal basePrice = ticketType.getBasePrice();
            int quantity = entry.getValue();

            // Discount by bulk
            BulkPricingRule bulkPricingRule = this.findBulkPricingRuleByTicketTypeId(ticketType.getId())
                    .orElse(null);
            int discountPercent = bulkPricingRule != null ?
                    bulkPricingRule.getDiscountPercent() : 0;

            BigDecimal priceForType = basePrice
                    .multiply(BigDecimal.valueOf(quantity))
                    .multiply(BigDecimal.valueOf(100 - discountPercent)) // 100 - discountRate
                    .divide(BigDecimal.valueOf(100), RoundingMode.HALF_EVEN);
            // Discount by Promotion



            ticketTypePriceMap.put(entry.getKey(), priceForType);
        }
        BigDecimal total = BigDecimal.ZERO;
        for (Map.Entry<TicketType, BigDecimal> entry : ticketTypePriceMap.entrySet()) {
            total = total.add(entry.getValue());
        }

        // now we got the total


        //return ticketMapper.toResponse(ticketOrder, ticketDetails);
        return null;

    }

    private Optional<BulkPricingRule> findBulkPricingRuleByTicketTypeId(Long id) {
        return bulkPricingRuleRepository.findByTicketType_Id(id);
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
