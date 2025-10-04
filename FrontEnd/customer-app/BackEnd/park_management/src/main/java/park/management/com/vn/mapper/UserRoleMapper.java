package park.management.com.vn.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import park.management.com.vn.entity.UserRole;
import park.management.com.vn.model.response.UserRoleResponse;

@Mapper(componentModel = "spring")
public interface UserRoleMapper {

    @Mapping(target = "roleId", source = "role.id")
    @Mapping(target = "roleName", source = "role.name")
    UserRoleResponse toResponse(UserRole entity);

    List<UserRoleResponse> toResponseList(List<UserRole> entities);
}