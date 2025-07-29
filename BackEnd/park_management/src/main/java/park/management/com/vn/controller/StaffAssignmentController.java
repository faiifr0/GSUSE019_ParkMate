package park.management.com.vn.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import park.management.com.vn.model.request.StaffAssignmentRequest;
import park.management.com.vn.model.response.StaffAssignmentResponse;

import java.util.List;

@RestController
@RequestMapping("/api/staff-assignments")
@RequiredArgsConstructor
public class StaffAssignmentController {

    private final StaffAssignmentController service;

    @PostMapping
    public ResponseEntity<StaffAssignmentResponse> create(@RequestBody @Valid StaffAssignmentRequest request) {
        return ResponseEntity.ok(service.create(request).getBody());
    }

    @GetMapping
    public ResponseEntity<List<StaffAssignmentResponse>> getAll() {
        return ResponseEntity.ok(service.getAll().getBody());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StaffAssignmentResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getById(id).getBody());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
    //    service.deleteById(id);
        return ResponseEntity.ok().build();
    }
}