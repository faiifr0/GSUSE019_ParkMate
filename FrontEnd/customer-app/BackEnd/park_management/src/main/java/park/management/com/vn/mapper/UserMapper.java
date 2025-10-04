package park.management.com.vn.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import park.management.com.vn.entity.UserEntity;
import park.management.com.vn.model.request.RegisterUserRequest;
import park.management.com.vn.model.response.RegisterUserResponse;
import park.management.com.vn.model.response.UserResponse;

@Mapper(componentModel = "spring")
public interface UserMapper {

  UserEntity toEntity(RegisterUserRequest request);

  RegisterUserResponse toRegisterUserResponse(UserEntity userEntity);

  @Mapping(target = "walletId", source = "wallet.id")
  @Mapping(target = "balance", source = "wallet.balance")
  @Mapping(target = "parkBranchId", source = "parkBranch.id")
  @Mapping(target = "parkBranchName", source = "parkBranch.name")
  UserResponse toUserDetailResponse(UserEntity userEntity);
}
