package park.management.com.vn.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import park.management.com.vn.model.request.BranchPromotionRequest;
import park.management.com.vn.model.response.BranchPromotionResponse;
import park.management.com.vn.service.BranchPromotionService;

import java.util.List;

@RestController
@RequestMapping("/api/branch-promotion")
@RequiredArgsConstructor
public class BranchPromotionController {

    private final BranchPromotionService service;

    @GetMapping("/{id}")
    public ResponseEntity<BranchPromotionResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<BranchPromotionResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping
    public ResponseEntity<BranchPromotionResponse> create(@RequestBody BranchPromotionRequest request) {
        return ResponseEntity.ok(service.create(request));
    }


    @PutMapping("/{id}")
    public ResponseEntity<BranchPromotionResponse> update(@PathVariable Long id, @RequestBody BranchPromotionRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}