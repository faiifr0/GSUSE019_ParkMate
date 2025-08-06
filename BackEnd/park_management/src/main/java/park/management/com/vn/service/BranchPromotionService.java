package park.management.com.vn.service;

import park.management.com.vn.model.request.BranchPromotionRequest;
import park.management.com.vn.model.response.BranchPromotionResponse;

import java.util.List;

public interface BranchPromotionService {
    BranchPromotionResponse getBranchPromotionById(Long id);

    List<BranchPromotionResponse> getAllBranchPromotion();

    BranchPromotionResponse createBranchPromotion(BranchPromotionRequest request);

    BranchPromotionResponse updateBranchPromotion(Long id, BranchPromotionRequest request);

    void deleteBranchPromotion(Long id);
}
