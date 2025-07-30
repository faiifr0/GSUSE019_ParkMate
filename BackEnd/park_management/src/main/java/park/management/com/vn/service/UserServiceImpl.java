package park.management.com.vn.service;

import java.util.List;
import java.util.Optional;

import lombok.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import park.management.com.vn.entity.Users;
import park.management.com.vn.mapper.UserMapper;
import park.management.com.vn.model.request.LoginRequest;
import park.management.com.vn.model.request.RegisterUserRequest;
import park.management.com.vn.model.response.LoginResponse;
import park.management.com.vn.model.response.RegisterUserResponse;
import park.management.com.vn.repository.UserRepository;
import park.management.com.vn.utils.JWTTokenUtils;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;
  private final UserMapper userMapper;
  private final BCryptPasswordEncoder bCryptPasswordEncoder;
  private final JWTTokenUtils jwtTokenUtils;

  @Override
  public List<Users> getAllUsers() {
    return userRepository.findAll();
  }

  @Override
  public Optional<Users> getUserById(Integer id) {
    return userRepository.findById(id);
  }

  @Override
  public RegisterUserResponse createUser(RegisterUserRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new RuntimeException("Email is exists in system");
    }
    Users users = userMapper.toEntity(request);
    users.setUsername(request.getEmail());
    users.setPassword(bCryptPasswordEncoder.encode(request.getPassword()));
    return userMapper.toResponse(userRepository.save(users));
  }

  @Override
  public Users updateUser(Integer id, Users updatedUsers) {
    return userRepository.findById(id).map(user -> {
      user.setUsername(updatedUsers.getUsername());
      user.setEmail(updatedUsers.getEmail());
      user.setPassword(updatedUsers.getPassword());
      return userRepository.save(user);
    }).orElseThrow(() -> new RuntimeException("User not found with id: " + id));
  }

  @Override
  public void deleteUser(Integer id) {
    userRepository.deleteById(id);
  }

  @Override
  public LoginResponse login(LoginRequest request) {
    Users users = userRepository.findByUsername(request.getUsername())
        .orElseThrow(() -> new RuntimeException("User not found"));
    if (bCryptPasswordEncoder.matches(request.getPassword(), users.getPassword())) {
      return LoginResponse.builder()
          .accessToken(jwtTokenUtils.generateAccessToken(request.getUsername()))
          .build();
    }
    throw new RuntimeException("Password incorrect");
  }
}
