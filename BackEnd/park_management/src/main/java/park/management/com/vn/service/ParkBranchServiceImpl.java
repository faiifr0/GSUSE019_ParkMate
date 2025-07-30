package park.management.com.vn.service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import park.management.com.vn.entity.ParkBranch;
import park.management.com.vn.mapper.ParkBranchMapper;
import park.management.com.vn.model.request.ParkBranchRequest;
import park.management.com.vn.model.response.ParkBranchResponse;
import park.management.com.vn.repository.ParkBranchRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ParkBranchServiceImpl implements ParkBranchService {

    private final ParkBranchRepository repository;
    private final ParkBranchMapper mapper;

    @Override
    public List<ParkBranchResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ParkBranchResponse create(ParkBranchRequest request) {
        ParkBranch entity = mapper.toEntity(request);
        ParkBranch saved = repository.save(entity);
        return mapper.toResponse(saved);
    }

    @Override
    public ParkBranchResponse update(Long id, ParkBranchRequest request) {
        ParkBranch updated = repository.findById(id)
                .map(branch -> {
                    branch.setName(request.getName());
                    branch.setAddress(request.getAddress());
                    branch.setLocation(request.getLocation());
                    branch.setOpen(request.getOpen());
                    branch.setClose(request.getClose());
                    return repository.save(branch);
                })
                .orElseThrow(() -> new RuntimeException("Branch not found with id: " + id));
        return mapper.toResponse(updated);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
