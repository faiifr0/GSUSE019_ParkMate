package park.management.com.vn.service;

import park.management.com.vn.model.request.StaffAssignmentRequest;
import park.management.com.vn.model.response.StaffAssignmentResponse;

import java.util.List;

public interface StaffAssignmentService {

    StaffAssignmentResponse create(StaffAssignmentRequest request);
    StaffAssignmentResponse getById(Long id);
    List<StaffAssignmentResponse> getAll();
    StaffAssignmentResponse update(Long id, StaffAssignmentRequest request);
    void deleteById(Long id);
}