package park.management.com.vn.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import park.management.com.vn.entity.PriceInfo;

@Repository
public interface TicketPriceRepository extends
        JpaRepository<PriceInfo, Long>,
        JpaSpecificationExecutor<PriceInfo> {


}
