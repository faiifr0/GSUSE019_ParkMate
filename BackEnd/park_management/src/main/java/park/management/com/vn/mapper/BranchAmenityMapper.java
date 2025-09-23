package park.management.com.vn.mapper;

import org.mapstruct.Mapper;

import park.management.com.vn.entity.BranchAmenity;
import park.management.com.vn.model.request.BranchAmenityRequest;
import park.management.com.vn.model.response.BranchAmenityResponse;

@Mapper(componentModel = "spring")
public interface BranchAmenityMapper {
    BranchAmenity toEntity(BranchAmenityRequest request);
    
    BranchAmenityResponse toResponse(BranchAmenity entity);
}
