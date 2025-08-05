package park.management.com.vn.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import park.management.com.vn.entity.BranchStaff;
import park.management.com.vn.entity.Shift;
import park.management.com.vn.entity.StaffAssignment;
import park.management.com.vn.mapper.StaffAssignmentMapper;
import park.management.com.vn.model.request.StaffAssignmentRequest;
import park.management.com.vn.model.response.StaffAssignmentResponse;
import park.management.com.vn.repository.BranchStaffRepository;
import park.management.com.vn.repository.ShiftRepository;
import park.management.com.vn.repository.StaffAssignmentRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StaffAssignmentServiceImpl implements StaffAssignmentService{

    private final StaffAssignmentRepository repository;
    private final BranchStaffRepository branchStaffRepository;
    private final ShiftRepository shiftRepository;
    private final StaffAssignmentMapper mapper;

    @Override
    public StaffAssignmentResponse createStaffAssignment(StaffAssignmentRequest request) {
        BranchStaff staff = branchStaffRepository.findById(request.getStaffId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy BranchStaff với ID: " + request.getStaffId()));

        Shift shift = shiftRepository.findById(request.getShiftId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Shift với ID: " + request.getShiftId()));

        StaffAssignment entity = new StaffAssignment();
        entity.setAssignedDate(request.getAssignedDate());
        entity.setStaff(staff);
        entity.setShift(shift);

        return mapper.toResponse(repository.save(entity));
    }

    @Override
    public StaffAssignmentResponse getStaffAssignmentById(Long id) {
        StaffAssignment entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy StaffAssignment với ID: " + id));
        return mapper.toResponse(entity);
    }

    @Override
    public List<StaffAssignmentResponse> getAllStaffAssignment() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public StaffAssignmentResponse updateStaffAssignment(Long id, StaffAssignmentRequest request) {
        StaffAssignment existing = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy StaffAssignment với ID: " + id));

        BranchStaff staff = branchStaffRepository.findById(request.getStaffId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy BranchStaff với ID: " + request.getStaffId()));

        Shift shift = shiftRepository.findById(request.getShiftId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy Shift với ID: " + request.getShiftId()));

        existing.setAssignedDate(request.getAssignedDate());
        existing.setStaff(staff);
        existing.setShift(shift);

        return mapper.toResponse(repository.save(existing));
    }

    @Override
    public void deleteStaffAssignmentById(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Không tìm thấy StaffAssignment với ID: " + id);
        }
        repository.deleteById(id);
    }
}