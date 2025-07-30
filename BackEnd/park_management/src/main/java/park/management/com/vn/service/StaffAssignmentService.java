package park.management.com.vn.service;

import park.management.com.vn.model.request.StaffAssignmentRequest;
import park.management.com.vn.model.response.StaffAssignmentResponse;

import java.util.List;

public interface StaffAssignmentService {

    StaffAssignmentResponse createAssignment(StaffAssignmentRequest request);

    StaffAssignmentResponse getAssignmentById(Integer id);

    List<StaffAssignmentResponse> getAllAssignments();

    void deleteAssignment(Integer id);
}
