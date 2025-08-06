package park.management.com.vn.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;
import park.management.com.vn.constant.DiscountType;
import park.management.com.vn.constant.TicketStatus;
import park.management.com.vn.entity.*;
import park.management.com.vn.exception.promotion.InvalidPromotionBranchException;
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
    @Transactional(rollbackOn = Exception.class)
    public Long createTicketOrder(TicketRequest ticketRequest, Long userId) {

        //Customer customer = customerService.getCustomerById(request.getCustomerId());
        Users customer = userService.getUserById(userId);

        ParkBranch branch = parkBranchService.getById(ticketRequest.getBranchId());

        LocalDate ticketDate = ticketRequest.getTicketDate();

        //Prepare a map to check inventory available quantity for each detail request
        Map<Pair<Long, LocalDate>, Integer> remainingCapacityMap = new HashMap<>();
        //This map is for pricing
        Map<TicketType, Integer> ticketTypeQuantityMap = new HashMap<>();
        //
        Map<TicketType, BigDecimal> ticketTypePriceMap = new HashMap<>();

        for (TicketRequest.TicketDetailRequest detailRequest : ticketRequest.getDetails()) {
            //🔹#1. Validate each ticket detail
            TicketType ticketType = this.getTicketTypeById(detailRequest.getTicketTypeId());

            Integer quantityRequested = detailRequest.getQuantity();

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


        } // end loop for ticket details

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

            BigDecimal priceForType = calculateDiscountedPrice(basePrice, quantity, discountPercent);

            ticketTypePriceMap.put(entry.getKey(), priceForType);
        }
        BigDecimal total = BigDecimal.ZERO;
        for (Map.Entry<TicketType, BigDecimal> entry : ticketTypePriceMap.entrySet()) {
            total = total.add(entry.getValue());
        }

        // now we got the total

        //Discount by promotion code here, we subtract right from the total
        Optional<BranchPromotion> promotion = branchPromotionService
                .findBranchPromotionById(ticketRequest.getPromotionId());

        BigDecimal promotionDiscount = BigDecimal.ZERO;

        if (promotion.isPresent()) {
            BranchPromotion promo = promotion.get();
            if (!Boolean.TRUE.equals(promotion.get().getIsActive()))
                throw new PromotionNotActiveException(promo.getId());

            if (ticketDate.isBefore(promo.getValidFrom().toLocalDate()) ||
                    ticketDate.isAfter(promo.getValidUntil().toLocalDate()))
                throw new PromotionExpiredException(promo.getId());

            // ✅ Validate promotion belongs to the same branch
            if (promo.getParkBranch() != null && !promo.getParkBranch().getId().equals(branch.getId())) {
                throw new InvalidPromotionBranchException(promo.getId());
            }

            promotionDiscount = promo.getDiscountType() == DiscountType.FIXED_AMOUNT
                    ? promo.getDiscountValue()
                    : total.multiply(promo.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), RoundingMode.HALF_EVEN);
        }

        BigDecimal net = total.compareTo(promotionDiscount) >= 0 ?
                total.subtract(promotionDiscount) : BigDecimal.ZERO;

        //Build and save order
        TicketOrder order = TicketOrder.builder()
                .user(customer)
                .parkBranch(branch)
                .ticketDate(ticketDate)
                .status(TicketStatus.PENDING)
                .totalAmount(total)
                .finalAmount(net)
                .promotion(promotion.orElse(null))
                .build();

        final TicketOrder savedOrder = ticketRepository.save(order);

        // Build and save details
        List<TicketDetail> details = new ArrayList<>();
        for (Map.Entry<TicketType, Integer> entry : ticketTypeQuantityMap.entrySet()) {
            TicketType ticketType = entry.getKey();
            int quantity = entry.getValue();
            BigDecimal unitPrice = ticketType.getBasePrice();

            BulkPricingRule bulkPricingRule = this.findBulkPricingRuleByTicketTypeId(ticketType.getId())
                    .orElse(null);
            int discountPercent = bulkPricingRule != null ? bulkPricingRule.getDiscountPercent() : 0;

            BigDecimal finalPrice = this.calculateDiscountedPrice(
                    unitPrice, quantity, discountPercent
            );

            TicketDetail ticketDetail = TicketDetail.builder()
                    .ticketOrder(savedOrder)
                    .ticketType(ticketType)
                    .quantity(quantity)
                    .unitPrice(unitPrice)
                    .discountPercent(discountPercent)
                    .finalPrice(finalPrice)
                    .build();

            details.add(ticketDetail);

        }
        ticketDetailRepository.saveAll(details);

        this.updateDailyInventoryAfterPurchase(ticketTypeQuantityMap, ticketDate);

        return savedOrder.getId();

    }

    @Transactional(rollbackOn = Exception.class)
    void updateDailyInventoryAfterPurchase(Map<TicketType, Integer> ticketTypeQuantityMap, LocalDate ticketDate) {
        List<DailyTicketInventory> updatedInventories = new ArrayList<>();

        for (Map.Entry<TicketType, Integer> entry : ticketTypeQuantityMap.entrySet()) {
            TicketType ticketType = entry.getKey();
            int quantity = entry.getValue();

            DailyTicketInventory inventory = this.getDailyTicketInventory(ticketType.getId(), ticketDate);

            // Update the 'sold' count
            int updatedSold = inventory.getSold() + quantity;

            if (updatedSold > inventory.getTotalAvailable()) {
                throw new IllegalStateException("Overselling tickets for " + ticketType.getName());
            }

            inventory.setSold(updatedSold);
            updatedInventories.add(inventory);
        }

        dailyTicketInventoryRepository.saveAll(updatedInventories);
    }

    @Override
    public TicketResponse getTicketResponseById(Long ticketId) {
        TicketOrder order = this.getTicketOrderById(ticketId);

        List<TicketDetail> details = ticketDetailRepository.findByTicketOrder_Id(ticketId);

        return ticketMapper.toResponse(order, details);
    }

    private Optional<BulkPricingRule> findBulkPricingRuleByTicketTypeId(Long id) {
        return bulkPricingRuleRepository.findByTicketType_Id(id);
    }

    private BigDecimal calculateDiscountedPrice(BigDecimal basePrice, int quantity, int discountPercent) {
        return basePrice
                .multiply(BigDecimal.valueOf(quantity))
                .multiply(BigDecimal.valueOf(100 - discountPercent))
                .divide(BigDecimal.valueOf(100), RoundingMode.HALF_EVEN);
    }



}
