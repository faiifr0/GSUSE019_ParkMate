package park.management.com.vn.service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import park.management.com.vn.entity.ParkBranch;
import park.management.com.vn.repository.ParkBranchRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ParkBranchServiceImpl implements ParkBranchService {

    private final ParkBranchRepository parkBranchRepository;

    @Override
    public List<ParkBranch> getAllBranches() {
        return parkBranchRepository.findAll();
    }

    @Override
    public Optional<ParkBranch> getBranchById(Long id) {
        return parkBranchRepository.findById(id);
    }

    @Override
    public ParkBranch createBranch(ParkBranch branch) {
        return parkBranchRepository.save(branch);
    }

    @Override
    public ParkBranch updateBranch(Long id, ParkBranch updatedBranch) {
        return parkBranchRepository.findById(id).map(branch -> {
            branch.setName(updatedBranch.getName());
            branch.setAddress(updatedBranch.getAddress());
            branch.setOpeningHours(updatedBranch.getOpeningHours());
            branch.setCreatedBy(updatedBranch.getCreatedBy());
            return parkBranchRepository.save(branch);
        }).orElseThrow(() -> new RuntimeException("ParkBranch not found with id: " + id));
    }

    @Override
    public void deleteBranch(Long id) {
        parkBranchRepository.deleteById(id);
    }
}
