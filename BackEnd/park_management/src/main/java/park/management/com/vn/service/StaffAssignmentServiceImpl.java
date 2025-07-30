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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffAssignmentServiceImpl implements StaffAssignmentService{

    private final StaffAssignmentRepository assignmentRepository;
    private final BranchStaffRepository staffRepository;
    private final ShiftRepository shiftRepository;
    private final StaffAssignmentMapper mapper;

    @Override
    public StaffAssignmentResponse createAssignment(StaffAssignmentRequest request) {
        BranchStaff staff = staffRepository.findById(request.getStaffId())
                .orElseThrow(() -> new EntityNotFoundException("Staff ID " + request.getStaffId() + " not found"));

        Shift shift = shiftRepository.findById(request.getShiftId())
                .orElseThrow(() -> new EntityNotFoundException("Shift ID " + request.getShiftId() + " not found"));

        StaffAssignment assignment = new StaffAssignment();
        assignment.setAssignedDate(request.getAssignedDate());
        assignment.setStaff(staff);
        assignment.setShift(shift);

        StaffAssignment saved = assignmentRepository.save(assignment);
        return mapper.toResponse(saved);
    }

    @Override
    public StaffAssignmentResponse getAssignmentById(Integer id) {
        StaffAssignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Assignment ID " + id + " not found"));
        return mapper.toResponse(assignment);
    }

    @Override
    public List<StaffAssignmentResponse> getAllAssignments() {
        return assignmentRepository.findAll().stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public void deleteAssignment(Integer id) {
        assignmentRepository.deleteById(id);
    }
}
