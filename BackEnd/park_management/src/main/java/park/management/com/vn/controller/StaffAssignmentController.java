package park.management.com.vn.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import park.management.com.vn.model.request.StaffAssignmentRequest;
import park.management.com.vn.model.response.StaffAssignmentResponse;
import park.management.com.vn.service.StaffAssignmentService;

import java.util.List;

@RestController
@RequestMapping("/api/staff-assignments")
@RequiredArgsConstructor
public class StaffAssignmentController {

    private final StaffAssignmentService staffAssignmentService;

    @GetMapping
    public ResponseEntity<List<StaffAssignmentResponse>> getAll() {
        return ResponseEntity.ok(staffAssignmentService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StaffAssignmentResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(staffAssignmentService.getById(id));
    }

    @PostMapping
    public ResponseEntity<StaffAssignmentResponse> create(@Valid @RequestBody StaffAssignmentRequest request) {
        StaffAssignmentResponse response = staffAssignmentService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StaffAssignmentResponse> update(@PathVariable Long id,
                                                          @Valid @RequestBody StaffAssignmentRequest request) {
        StaffAssignmentResponse response = staffAssignmentService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        staffAssignmentService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}