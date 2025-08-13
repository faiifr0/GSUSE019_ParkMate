package park.management.com.vn.service;

import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.transaction.annotation.Transactional;
import park.management.com.vn.entity.DailyTicketInventory;
import park.management.com.vn.entity.TicketType;
import park.management.com.vn.model.request.DailyTicketInventoryRequest;
import park.management.com.vn.model.response.DailyTicketInventoryResponse;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

public interface DailyTicketInventoryService {
    DailyTicketInventory getDailyTicketInventoryByTicketTypeAndDate
            (Long ticketTypeId, LocalDate ticketDate);

    @Transactional(rollbackFor = Exception.class)
    Long createDailyTicketInventory(DailyTicketInventoryRequest request);

    @Transactional(noRollbackFor = OptimisticLockingFailureException.class)
    void reserveInventoryOrThrow(Long ticketTypeId, LocalDate date, int qty);

    @Transactional(rollbackFor = Exception.class)
    void updateDailyInventoryAfterPurchase(Map<TicketType, Integer> ticketTypeQuantityMap, LocalDate ticketDate);

    DailyTicketInventory getDailyTicketInventoryById(Long id);

    Optional<DailyTicketInventory> findDailyTicketInventoryById(Long id);

    DailyTicketInventoryResponse getDailyTicketInventoryResponseById(Long id);
}
