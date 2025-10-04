package park.management.com.vn.service;

import park.management.com.vn.model.request.BranchAmenityRequest;
import park.management.com.vn.model.response.BranchAmenityResponse;

public interface BranchAmenityService {

    BranchAmenityResponse createBranchAmenity(BranchAmenityRequest request);
    BranchAmenityResponse getBranchAmenityById(Long id);
    BranchAmenityResponse updateBranchAmenity(Long id, BranchAmenityRequest request);
}
