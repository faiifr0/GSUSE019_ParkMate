package park.management.com.vn.service;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import park.management.com.vn.entity.Users;
import park.management.com.vn.model.request.LoginRequest;
import park.management.com.vn.model.request.RegisterUserRequest;
import park.management.com.vn.model.response.LoginResponse;
import park.management.com.vn.model.response.RegisterUserResponse;

public interface UserService {

  List<Users> getAllUsers();

  Optional<Users> getUserById(Long id);

  RegisterUserResponse createUser(RegisterUserRequest request);

  Users updateUser(Long id, Users users);

  void deleteUser(Long id);

  LoginResponse login(@Valid LoginRequest request);
}
