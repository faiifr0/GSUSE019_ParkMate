package park.management.com.vn.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import park.management.com.vn.model.request.BranchReviewRequest;
import park.management.com.vn.model.response.BranchReviewResponse;
import park.management.com.vn.service.BranchReviewService;

import java.util.List;

@RestController
@RequestMapping("/api/branch-review")
@RequiredArgsConstructor
public class BranchReviewController {

    private final BranchReviewService reviewService;
    
    @GetMapping
    public ResponseEntity<List<BranchReviewResponse>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @GetMapping("/of-branch/{branchId}")
    public ResponseEntity<List<BranchReviewResponse>> getAllOfBranch(@PathVariable Long branchId) {
        return ResponseEntity.ok(reviewService.getAllOfBranch(branchId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BranchReviewResponse> getReviewById(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getReviewById(id));
    }

    @PostMapping
    public ResponseEntity<BranchReviewResponse> createReview(@Valid @RequestBody BranchReviewRequest request) {
        BranchReviewResponse response = reviewService.createReview(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BranchReviewResponse> updateReview(@PathVariable Long id, @Valid @RequestBody BranchReviewRequest request) {
        BranchReviewResponse response = reviewService.updateReview(id, request);
        return ResponseEntity.ok(response);
    }
}

