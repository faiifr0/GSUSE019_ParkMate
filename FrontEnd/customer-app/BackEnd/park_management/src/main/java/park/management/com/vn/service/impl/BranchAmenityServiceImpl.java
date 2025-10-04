package park.management.com.vn.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import park.management.com.vn.entity.AmenityType;
import park.management.com.vn.entity.BranchAmenity;
import park.management.com.vn.entity.ParkBranch;
import park.management.com.vn.mapper.BranchAmenityMapper;
import park.management.com.vn.model.request.BranchAmenityRequest;
import park.management.com.vn.model.response.BranchAmenityResponse;
import park.management.com.vn.repository.AmenityTypeRepository;
import park.management.com.vn.repository.BranchAmenityRepository;
import park.management.com.vn.repository.ParkBranchRepository;

import park.management.com.vn.service.BranchAmenityService;

@Service
@RequiredArgsConstructor
public class BranchAmenityServiceImpl implements BranchAmenityService {

    private final BranchAmenityRepository branchAmenityRepo;
    private final AmenityTypeRepository amenityTypeRepo;
    private final ParkBranchRepository branchRepo;
    private final BranchAmenityMapper mapper;

    @Override
    public BranchAmenityResponse createBranchAmenity(BranchAmenityRequest request) {
        AmenityType amenityType = amenityTypeRepo.findById(request.getAmenityTypeId())
                .orElseThrow(() -> new RuntimeException("Amenity Type not found!"));
        ParkBranch branch = branchRepo.findById(request.getParkBranchId())
                .orElseThrow(() -> new RuntimeException("Park Branch not found!"));

        BranchAmenity branchAmenity = mapper.toEntity(request);
        branchAmenity.setAmenityType(amenityType);
        branchAmenity.setParkBranch(branch);

        BranchAmenity saved = branchAmenityRepo.save(branchAmenity);
        return mapper.toResponse(saved);
    }    

    @Override
    public BranchAmenityResponse getBranchAmenityById(Long id) {
        BranchAmenity branchAmenity = branchAmenityRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Branch Amenity not found!"));
        return mapper.toResponse(branchAmenity);
    }

    @Override
    public BranchAmenityResponse updateBranchAmenity(Long id, BranchAmenityRequest request) {
        BranchAmenity branchAmenity = branchAmenityRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Branch Amenity not found!"));
        AmenityType amenityType = amenityTypeRepo.findById(request.getAmenityTypeId())
                .orElseThrow(() -> new RuntimeException("Amenity Type not found!"));
        ParkBranch branch = branchRepo.findById(request.getParkBranchId())
                .orElseThrow(() -> new RuntimeException("Park Branch not found!"));

        branchAmenity.setAmenityType(amenityType);
        branchAmenity.setName(request.getName());
        branchAmenity.setDescription(request.getDescription());
        branchAmenity.setStatus(request.getStatus());

        BranchAmenity updated = branchAmenityRepo.save(branchAmenity);        

        return mapper.toResponse(updated);
    }
}
