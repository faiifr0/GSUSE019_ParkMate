package park.management.com.vn.service;

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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffAssignmentServiceImpl implements StaffAssignmentService{

    private final StaffAssignmentRepository repository;
    private final StaffAssignmentMapper mapper;

    @Override
    public List<StaffAssignmentResponse> getAll() {
        return repository.findAll().stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public StaffAssignmentResponse getById(Integer id) {
        StaffAssignment entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy assignment"));
        return mapper.toResponse(entity);
    }

    @Override
    public StaffAssignmentResponse create(StaffAssignmentRequest request) {
        StaffAssignment entity = mapper.toEntity(request);
        return mapper.toResponse(repository.save(entity));
    }

    @Override
    public StaffAssignmentResponse update(Integer id, StaffAssignmentRequest request) {
        StaffAssignment existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy assignment"));

        existing.setAssignedDate(request.getAssignedDate());
        existing.setStaff(new BranchStaff(request.getStaffId()));
        existing.setShift(new Shift(request.getShiftId()));

        return mapper.toResponse(repository.save(existing));
    }

    @Override
    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}
