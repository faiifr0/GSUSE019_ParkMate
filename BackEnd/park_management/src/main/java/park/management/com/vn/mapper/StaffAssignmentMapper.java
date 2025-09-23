package park.management.com.vn.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import park.management.com.vn.entity.StaffAssignment;
import park.management.com.vn.model.request.StaffAssignmentRequest;
import park.management.com.vn.model.response.StaffAssignmentResponse;

@Mapper(componentModel = "spring")
public interface StaffAssignmentMapper {
    StaffAssignment toEntity(StaffAssignmentRequest request);

    @Mapping(target = "staffName", source = "staff.userEntity.username")
    @Mapping(target = "shiftId", source = "shift.id")
    StaffAssignmentResponse toResponse(StaffAssignment entity);
}
