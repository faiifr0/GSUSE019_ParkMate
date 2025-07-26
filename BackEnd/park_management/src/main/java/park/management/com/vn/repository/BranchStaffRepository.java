package park.management.com.vn.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import park.management.com.vn.entity.BranchStaff;
import park.management.com.vn.model.response.BranchStaffResponse;

import java.util.List;

@Repository
public interface BranchStaffRepository extends JpaRepository<BranchStaff, Integer> {
    List<BranchStaff> findByUser_Id(Integer userId);
    List<BranchStaff> findByParkBranch_Id(Integer branchId);
}
