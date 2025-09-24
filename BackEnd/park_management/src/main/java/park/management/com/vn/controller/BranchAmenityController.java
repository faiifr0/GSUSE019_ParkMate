package park.management.com.vn.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import park.management.com.vn.entity.BranchAmenity;
import park.management.com.vn.model.request.BranchAmenityRequest;
import park.management.com.vn.model.request.UpdateImageRequest;
import park.management.com.vn.model.response.BranchAmenityResponse;
import park.management.com.vn.repository.BranchAmenityRepository;
import park.management.com.vn.service.BranchAmenityService;

import java.util.List;

@RestController
@RequestMapping("/api/branch-amenities")
@RequiredArgsConstructor
@Tag(name = "branch-amenity-controller")
public class BranchAmenityController {

  private final BranchAmenityService branchAmenityService;
  private final BranchAmenityRepository branchAmenityRepository;

  @GetMapping
  public ResponseEntity<List<BranchAmenity>> list() {
    return ResponseEntity.ok(branchAmenityRepository.findAll());
  }  

  // NEW: getAll...ofBranch
  @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
  @GetMapping("/of-branch/{branchId}")
  public ResponseEntity<List<BranchAmenity>> ofBranch(@PathVariable Long branchId) {
    return ResponseEntity.ok(branchAmenityRepository.findByParkBranch_Id(branchId));
  }

  // NEW: update ảnh riêng
  @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
  @PutMapping("/{id}/image")
  public ResponseEntity<Void> updateImage(@PathVariable Long id,
                                          @RequestBody @Valid UpdateImageRequest req) {
    BranchAmenity a = branchAmenityRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("AMENITY_NOT_FOUND"));
    a.setImageUrl(req.getImageUrl()); // đảm bảo entity có field imageUrl
    branchAmenityRepository.save(a);
    return ResponseEntity.ok(null);
  }

  @GetMapping("/{id}")
  public ResponseEntity<BranchAmenityResponse> getBranchAmenityById(@PathVariable Long id) {
    return ResponseEntity.ok(branchAmenityService.getBranchAmenityById(id));
  }

  @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
  @PostMapping
  public ResponseEntity<BranchAmenityResponse> createBranchAmenity(@Valid @RequestBody BranchAmenityRequest request) {
    BranchAmenityResponse response = branchAmenityService.createBranchAmenity(request);
    return new ResponseEntity<>(response, HttpStatus.CREATED);
  }

  @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
  @PutMapping("/{id}")
  public ResponseEntity<BranchAmenityResponse> updateBranchAmenity(@PathVariable Long id, @Valid @RequestBody BranchAmenityRequest request) {
    BranchAmenityResponse response = branchAmenityService.updateBranchAmenity(id, request);
    return new ResponseEntity<>(response, HttpStatus.CREATED);
  }
}
