package park.management.com.vn.service;

import java.util.List;
import java.util.Optional;
import park.management.com.vn.entity.ParkBranch;

public interface ParkBranchService {

  List<ParkBranch> getAllBranches();

  Optional<ParkBranch> getBranchById(Long id);

  ParkBranch createBranch(ParkBranch branch);

  ParkBranch updateBranch(Long id, ParkBranch branch);

  void deleteBranch(Long id);
}
