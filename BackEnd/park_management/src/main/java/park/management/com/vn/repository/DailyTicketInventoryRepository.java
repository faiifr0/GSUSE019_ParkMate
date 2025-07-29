package park.management.com.vn.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import park.management.com.vn.entity.DailyTicketInventory;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface DailyTicketInventoryRepository extends JpaRepository<DailyTicketInventory,Long> {

    Optional<DailyTicketInventory> getDailyTicketInventoriesByTicketType_IdAndDate
            (Long ticketTypeId, LocalDate ticketDate);

}
