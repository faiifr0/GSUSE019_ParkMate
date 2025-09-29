package park.management.com.vn.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import park.management.com.vn.entity.BranchAmenity;
import park.management.com.vn.model.request.BranchAmenityRequest;
import park.management.com.vn.model.response.BranchAmenityResponse;

@Mapper(componentModel = "spring")
public interface BranchAmenityMapper {
    BranchAmenity toEntity(BranchAmenityRequest request);
    
    @Mapping(target = "parkBranchId", source = "parkBranch.id")
    @Mapping(target = "amenityTypeId", source = "amenityType.id")
    BranchAmenityResponse toResponse(BranchAmenity entity);

    // Mapping for list
    List<BranchAmenityResponse> toResponseList(List<BranchAmenity> entities);
}
