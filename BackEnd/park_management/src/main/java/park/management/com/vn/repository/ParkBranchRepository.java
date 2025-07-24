package park.management.com.vn.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import park.management.com.vn.entity.ParkBranch;

@Repository
public interface ParkBranchRepository extends JpaRepository<ParkBranch,Long> {
}
