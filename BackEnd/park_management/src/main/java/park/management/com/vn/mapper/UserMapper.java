package park.management.com.vn.mapper;

import org.mapstruct.Mapper;
import park.management.com.vn.entity.User;
import park.management.com.vn.model.request.RegisterUserRequest;
import park.management.com.vn.model.response.RegisterUserResponse;

@Mapper(componentModel = "spring")
public interface UserMapper {

  User toEntity(RegisterUserRequest request);

  RegisterUserResponse toResponse(User user);
}
