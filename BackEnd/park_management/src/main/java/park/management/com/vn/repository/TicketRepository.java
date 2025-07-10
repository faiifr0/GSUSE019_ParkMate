package park.management.com.vn.repository;

import java.util.List;
import park.management.com.vn.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepository extends JpaRepository<Ticket,Long> {
    List<Ticket> findByParkBranchId(Long branchId);
    List<Ticket> findByEventId(Long eventId);
}
