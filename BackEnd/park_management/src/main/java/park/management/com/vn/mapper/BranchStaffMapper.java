package park.management.com.vn.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import park.management.com.vn.entity.BranchStaff;
import park.management.com.vn.model.request.BranchStaffRequest;
import park.management.com.vn.model.response.BranchStaffResponse;


@Mapper(componentModel = "spring")
public interface BranchStaffMapper {
    BranchStaff toEntity(BranchStaffRequest request);

    @Mapping(target = "userFullName", source = "userEntity.username")
    @Mapping(target = "parkBranchName", source = "parkBranch.name")
    BranchStaffResponse toResponse(BranchStaff entity);
}