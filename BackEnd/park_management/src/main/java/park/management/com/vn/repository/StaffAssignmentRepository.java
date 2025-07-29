package park.management.com.vn.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import park.management.com.vn.entity.StaffAssignment;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface StaffAssignmentRepository extends JpaRepository<StaffAssignment, Integer> {
    List<StaffAssignment> findByAssignedDate(LocalDate assignedDate);
    List<StaffAssignment> findByStaffId(Integer staffId);
}
