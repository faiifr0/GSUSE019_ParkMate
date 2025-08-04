package park.management.com.vn.service;

import park.management.com.vn.model.request.BranchPromotionRequest;
import park.management.com.vn.model.response.BranchPromotionResponse;

import java.util.List;

public interface BranchPromotionService {
    BranchPromotionResponse getById(Long id);

    List<BranchPromotionResponse> getAll();

    BranchPromotionResponse create(BranchPromotionRequest request);

    BranchPromotionResponse update(Long id, BranchPromotionRequest request);

    void delete(Long id);
}
