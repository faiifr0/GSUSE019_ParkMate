package park.management.com.vn.service;

import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import park.management.com.vn.entity.User;
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
  public List<User> getAllUsers() {
    return userRepository.findAll();
  }

  @Override
  public Optional<User> getUserById(Long id) {
    return userRepository.findById(id);
  }

  @Override
  public RegisterUserResponse createUser(RegisterUserRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new RuntimeException("Email is exists in system");
    }
    User user = userMapper.toEntity(request);
    user.setUsername(request.getEmail());
    user.setPassword(bCryptPasswordEncoder.encode(request.getPassword()));
    return userMapper.toResponse(userRepository.save(user));
  }

  @Override
  public User updateUser(Long id, User updatedUser) {
    return userRepository.findById(id).map(user -> {
      user.setUsername(updatedUser.getUsername());
      user.setEmail(updatedUser.getEmail());
      user.setPassword(updatedUser.getPassword());
      return userRepository.save(user);
    }).orElseThrow(() -> new RuntimeException("User not found with id: " + id));
  }

  @Override
  public void deleteUser(Long id) {
    userRepository.deleteById(id);
  }

  @Override
  public LoginResponse login(LoginRequest request) {
    User user = userRepository.findByUsername(request.getUsername())
        .orElseThrow(() -> new RuntimeException("User not found"));
    if (bCryptPasswordEncoder.matches(request.getPassword(), user.getPassword())) {
      return LoginResponse.builder()
          .accessToken(jwtTokenUtils.generateAccessToken(request.getUsername()))
          .build();
    }
    throw new RuntimeException("Password incorrect");
  }
}
