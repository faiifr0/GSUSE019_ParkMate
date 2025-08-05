package park.management.com.vn.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import park.management.com.vn.entity.BranchPromotion;
import park.management.com.vn.mapper.BranchPromotionMapper;
import park.management.com.vn.model.request.BranchPromotionRequest;
import park.management.com.vn.model.response.BranchPromotionResponse;
import park.management.com.vn.repository.BranchPromotionRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BranchPromotionServiceImpl implements BranchPromotionService{

    private final BranchPromotionRepository branchPromotionRepository;
    private final BranchPromotionMapper mapper;

    @Override
    public BranchPromotionResponse createBranchPromotion(BranchPromotionRequest request) {
        BranchPromotion entity = mapper.toEntity(request);
        return mapper.toResponse(branchPromotionRepository.save(entity));
    }

    @Override
    public BranchPromotionResponse getBranchPromotionById(Long id) {
        BranchPromotion entity = branchPromotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));
        return mapper.toResponse(entity);
    }

    @Override
    public List<BranchPromotionResponse> getAllBranchPromotion() {
        return branchPromotionRepository.findAll().stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BranchPromotionResponse updateBranchPromotion(Long id, BranchPromotionRequest request) {
        BranchPromotion entity = branchPromotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));
        BranchPromotion updated = mapper.toEntity(request);
        updated.setId(id);
        updated.setCreatedAt(entity.getCreatedAt());
        updated.setCreatedBy(entity.getCreatedBy());
        return mapper.toResponse(branchPromotionRepository.save(updated));
    }

    @Override
    public void deleteBranchPromotion(Long id) {
        branchPromotionRepository.deleteById(id);
    }

}
