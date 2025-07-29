package park.management.com.vn.service;

import park.management.com.vn.model.request.StaffAssignmentRequest;
import park.management.com.vn.model.response.StaffAssignmentResponse;

import java.util.List;

public interface StaffAssignmentService {

    List<StaffAssignmentResponse> getAll();

    StaffAssignmentResponse getById(Integer id);

    StaffAssignmentResponse create(StaffAssignmentRequest request);

    StaffAssignmentResponse update(Integer id, StaffAssignmentRequest request);

    void deleteById(Integer id);
}
