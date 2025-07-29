package park.management.com.vn.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import park.management.com.vn.entity.StaffAssignment;
import park.management.com.vn.model.request.StaffAssignmentRequest;
import park.management.com.vn.model.response.StaffAssignmentResponse;

@Mapper(componentModel = "spring")
public interface StaffAssignmentMapper {

    @Mapping(target = "staffId", source = "staff.id")
    @Mapping(target = "staffName", source = "staff.role") //staff.name???
    @Mapping(target = "shiftId", source = "shift.id")
    @Mapping(target = "shiftName", source = "shift.id") //there is no shift.name
    StaffAssignmentResponse toResponse(StaffAssignment entity);

    @Mapping(target = "staff", expression = "java(new BranchStaff(request.getStaffId()))")
    @Mapping(target = "shift", expression = "java(new Shift(request.getShiftId()))")
    StaffAssignment toEntity(StaffAssignmentRequest request);
}
