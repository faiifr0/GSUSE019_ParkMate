package park.management.com.vn.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import park.management.com.vn.entity.DailyTicketInventory;
import park.management.com.vn.entity.TicketType;
import park.management.com.vn.exception.ticket.DailyTicketInventoryExceedException;
import park.management.com.vn.exception.ticket.DailyTicketInventoryNotFoundException;
import park.management.com.vn.exception.ticket.TicketTypeNotFoundException;
import park.management.com.vn.mapper.DailyTicketInventoryMapper;
import park.management.com.vn.model.request.DailyTicketInventoryRequest;
import park.management.com.vn.model.response.DailyTicketInventoryResponse;
import park.management.com.vn.repository.DailyTicketInventoryRepository;
import park.management.com.vn.repository.TicketTypeRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DailyTicketInventoryServiceImpl implements DailyTicketInventoryService {

    private final DailyTicketInventoryRepository inventoryRepo;
    private final TicketTypeRepository ticketTypeRepo;

    private final DailyTicketInventoryMapper dailyTicketInventoryMapper;

    @PersistenceContext
    private EntityManager em;

    @Override
    public DailyTicketInventory getDailyTicketInventoryByTicketTypeAndDate
            (Long ticketTypeId, LocalDate ticketDate) {
        return inventoryRepo.findDailyTicketInventoryByTicketType_IdAndDate(ticketTypeId, ticketDate)
                .orElseThrow(() -> new DailyTicketInventoryNotFoundException(ticketTypeId, ticketDate));
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public Long createDailyTicketInventory(DailyTicketInventoryRequest request) {
        TicketType ticketType = ticketTypeRepo.findById(request.getTicketTypeId())
                .orElseThrow(() -> new TicketTypeNotFoundException(request.getTicketTypeId()));


        DailyTicketInventory newInventory = DailyTicketInventory.builder()
                .ticketType(ticketType)
                .capacity(request.getCapacity())
                .date(request.getDate())
                .build();

        final DailyTicketInventory savedInventory = inventoryRepo.save(newInventory);

        return savedInventory.getId();
    }

    @Transactional(noRollbackFor = OptimisticLockingFailureException.class)
    @Override
    public void reserveInventoryOrThrow(Long ticketTypeId, LocalDate date, int qty) {
        int attempts = 0;
        while (true) {
            try {
                DailyTicketInventory inventory = inventoryRepo
                        .findDailyTicketInventoryByTicketType_IdAndDate(ticketTypeId, date)
                        .orElseThrow(() -> new DailyTicketInventoryNotFoundException(ticketTypeId, date));

                int sold = Optional.ofNullable(inventory.getSold()).orElse(0);
                int capacity = Optional.ofNullable(inventory.getCapacity()).orElse(0);

                if (sold + qty > capacity) throw new DailyTicketInventoryExceedException(ticketTypeId, date);

                inventory.setSold(sold + qty);
                inventoryRepo.saveAndFlush(inventory);
                return;
            } catch (OptimisticLockingFailureException e) {
                if (++attempts > 3) throw e;
                em.clear();
                try {
                    Thread.sleep(10L * attempts);
                } catch (InterruptedException ignored) {
                }
            }
        }
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void updateDailyInventoryAfterPurchase(Map<TicketType, Integer> ticketTypeQuantityMap, LocalDate ticketDate) {
        List<DailyTicketInventory> updatedInventories = new ArrayList<>();

        for (Map.Entry<TicketType, Integer> entry : ticketTypeQuantityMap.entrySet()) {
            TicketType ticketType = entry.getKey();
            int quantity = entry.getValue();

            DailyTicketInventory inventory = this.getDailyTicketInventoryByTicketTypeAndDate(ticketType.getId(), ticketDate);

            // Update the 'sold' count
            int updatedSold = inventory.getSold() + quantity;

            if (updatedSold > inventory.getCapacity()) {
                throw new IllegalStateException("Overselling tickets for " + ticketType.getName());
            }

            inventory.setSold(updatedSold);
            updatedInventories.add(inventory);
        }

        inventoryRepo.saveAll(updatedInventories);
    }

    @Override
    public DailyTicketInventory getDailyTicketInventoryById(Long id) {
        return this.findDailyTicketInventoryById(id)
                .orElseThrow(() -> new DailyTicketInventoryNotFoundException(id));
    }

    @Override
    public Optional<DailyTicketInventory> findDailyTicketInventoryById(Long id) {
        return inventoryRepo.findById(id);
    }

    @Override
    public DailyTicketInventoryResponse getDailyTicketInventoryResponseById(Long id) {
        return dailyTicketInventoryMapper.toResponse(
                this.getDailyTicketInventoryById(id)
        );
    }


}
