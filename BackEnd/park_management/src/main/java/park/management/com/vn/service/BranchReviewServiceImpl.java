package park.management.com.vn.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import park.management.com.vn.entity.BranchReview;
import park.management.com.vn.entity.ParkBranch;
import park.management.com.vn.entity.Users;
import park.management.com.vn.mapper.BranchReviewMapper;
import park.management.com.vn.model.request.BranchReviewRequest;
import park.management.com.vn.model.response.BranchReviewResponse;
import park.management.com.vn.repository.BranchReviewRepository;
import park.management.com.vn.repository.ParkBranchRepository;
import park.management.com.vn.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BranchReviewServiceImpl implements BranchReviewService {

    private final BranchReviewRepository reviewRepo;
    private final UserRepository userRepo;
    private final ParkBranchRepository branchRepo;
    private final BranchReviewMapper mapper;

    @Override
    public BranchReviewResponse createReview(BranchReviewRequest request) {
        Users user = userRepo.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        ParkBranch branch = branchRepo.findById(request.getBranchId())
                .orElseThrow(() -> new RuntimeException("Branch not found"));

        BranchReview review = mapper.toEntity(request);
        review.setUser(user);
        review.setParkBranch(branch);

        BranchReview saved = reviewRepo.save(review);
        return mapper.toResponse(saved);
    }

    @Override
    public List<BranchReviewResponse> getAllReviews() {
        return reviewRepo.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public BranchReviewResponse getReviewById(Long id) {
        BranchReview review = reviewRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        return mapper.toResponse(review);
    }
}
