package park.management.com.vn.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import park.management.com.vn.entity.ParkBranch;
import park.management.com.vn.model.request.ParkBranchRequest;
import park.management.com.vn.model.response.ParkBranchResponse;
import park.management.com.vn.service.ParkBranchService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/park-branch")
public class ParkBranchController {

    private final ParkBranchService service;

    @GetMapping
    public ResponseEntity<List<ParkBranchResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping
    public ResponseEntity<ParkBranchResponse> create(@RequestBody ParkBranchRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParkBranchResponse> update(
            @PathVariable Integer id,
            @RequestBody ParkBranchRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
