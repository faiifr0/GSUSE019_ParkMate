package park.management.com.vn.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import park.management.com.vn.entity.Ticket;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

  List<Ticket> findByParkBranchId(Long branchId);
}
