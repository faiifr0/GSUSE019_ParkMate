package park.management.com.vn.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.stereotype.Service;
import park.management.com.vn.entity.BranchStaff;
import park.management.com.vn.entity.ParkBranch;
import park.management.com.vn.entity.Users;
import park.management.com.vn.mapper.BranchStaffMapper;
import park.management.com.vn.model.request.BranchStaffRequest;
import park.management.com.vn.model.response.BranchStaffResponse;
import park.management.com.vn.repository.BranchStaffRepository;
import park.management.com.vn.repository.ParkBranchRepository;
import park.management.com.vn.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BranchStaffServiceImpl implements BranchStaffService {

    private final BranchStaffRepository branchStaffRepository;
    private final UserRepository usersRepository;
    private final ParkBranchRepository parkBranchRepository;
    private final BranchStaffMapper mapper;

    @Override
    public BranchStaffResponse createBranchStaff(BranchStaffRequest request) {
        Users user = usersRepository.findById(request.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User ID " + request.getUserId() + " not found"));

        ParkBranch branch = parkBranchRepository.findById(request.getParkBranchId())
                .orElseThrow(() -> new EntityNotFoundException("Branch ID " + request.getParkBranchId() + " not found"));

        BranchStaff branchStaff = new BranchStaff();
        branchStaff.setUser(user);
        branchStaff.setParkBranch(branch);
        branchStaff.setRole(request.getRole());

        return mapper.toResponse(branchStaffRepository.save(branchStaff));
    }

    @Override
    public BranchStaffResponse getBranchStaffById(Long id) {
        BranchStaff branchStaff = branchStaffRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("BranchStaff ID " + id + " not found"));
        return mapper.toResponse(branchStaff);
    }

    @Override
    public List<BranchStaffResponse> getAllBranchStaff() {
        return branchStaffRepository.findAll().stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public void deleteBranchStaff(Long id) {
        if (!branchStaffRepository.existsById(id)) {
            throw new EntityNotFoundException("BranchStaff ID " + id + " not found");
        }
        branchStaffRepository.deleteById(id);
    }
}
