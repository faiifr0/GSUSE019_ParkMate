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
import park.management.com.vn.service.ParkBranchService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/branches")
public class ParkBranchController {

    private final ParkBranchService parkBranchService;

    @GetMapping
    public ResponseEntity<List<ParkBranch>> getAllBranches() {
        return ResponseEntity.ok(parkBranchService.getAllBranches());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParkBranch> getBranchById(@PathVariable Long id) {
        /*
        return parkBranchService.getBranchById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        */
        return ResponseEntity.ok(parkBranchService.getBranchById(id));

    }

    @PostMapping
    public ResponseEntity<ParkBranch> createBranch(@RequestBody ParkBranch branch) {
        return ResponseEntity.ok(parkBranchService.createBranch(branch));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParkBranch> updateBranch(@PathVariable Long id, @RequestBody ParkBranch branch) {
        return ResponseEntity.ok(parkBranchService.updateBranch(id, branch));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBranch(@PathVariable Long id) {
        parkBranchService.deleteBranch(id);
        return ResponseEntity.noContent().build();
    }
}
