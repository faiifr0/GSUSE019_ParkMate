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

    private final BranchPromotionRepository repository;
    private final BranchPromotionMapper mapper;

    @Override
    public BranchPromotionResponse create(BranchPromotionRequest request) {
        BranchPromotion entity = mapper.toEntity(request);
        return mapper.toResponse(repository.save(entity));
    }

    @Override
    public BranchPromotionResponse getById(Long id) {
        BranchPromotion entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));
        return mapper.toResponse(entity);
    }

    @Override
    public List<BranchPromotionResponse> getAll() {
        return repository.findAll().stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BranchPromotionResponse update(Long id, BranchPromotionRequest request) {
        BranchPromotion entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found"));
        BranchPromotion updated = mapper.toEntity(request);
        updated.setId(id);
        updated.setCreatedAt(entity.getCreatedAt());
        updated.setCreatedBy(entity.getCreatedBy());
        return mapper.toResponse(repository.save(updated));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

}
