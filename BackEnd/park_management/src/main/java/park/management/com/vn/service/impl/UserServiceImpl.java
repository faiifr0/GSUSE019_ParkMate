package park.management.com.vn.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import park.management.com.vn.constant.UserRoleConstant;
import park.management.com.vn.entity.ParkBranch;
import park.management.com.vn.entity.UserEntity;
import park.management.com.vn.entity.UserRole;
import park.management.com.vn.entity.Role;
import park.management.com.vn.entity.Wallet;
import park.management.com.vn.exception.user.UserNotFoundException;
import park.management.com.vn.mapper.UserMapper;
import park.management.com.vn.mapper.UserRoleMapper;
import park.management.com.vn.model.request.LoginRequest;
import park.management.com.vn.model.request.RegisterUserRequest;
import park.management.com.vn.model.request.UserRequest;
import park.management.com.vn.model.response.LoginResponse;
import park.management.com.vn.model.response.RegisterUserResponse;
import park.management.com.vn.model.response.UserResponse;
import park.management.com.vn.repository.ParkBranchRepository;
import park.management.com.vn.repository.RoleRepository;
import park.management.com.vn.repository.UserRepository;
import park.management.com.vn.repository.UserRoleRepository;
import park.management.com.vn.repository.WalletRepository;
import park.management.com.vn.service.UserService;
import park.management.com.vn.utils.JWTTokenUtils;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;
  private final WalletRepository walletRepository; // <-- THÊM
  private final UserRoleRepository userRoleRepository;
  private final RoleRepository roleRepository;
  private final ParkBranchRepository parkBranchRepository;
  private final UserMapper userMapper;
  private final UserRoleMapper userRoleMapper;
  private final BCryptPasswordEncoder bCryptPasswordEncoder;
  private final JWTTokenUtils jwtTokenUtils;
  private final BigDecimal STAFF_WALLET_BALANCE = BigDecimal.valueOf(100000000);

  @Override
  public List<UserEntity> getAllUsers() {
    return userRepository.findAll();
  }

  @Override
  public Optional<UserEntity> findUserById(Long id) {
    return userRepository.findById(id);
  }

  @Override
  public UserEntity getUserById(Long id) {
    return userRepository.findById(id)
        .orElseThrow(() -> new UserNotFoundException(id));
  }

  @Override
  public RegisterUserResponse createUser(RegisterUserRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new RuntimeException("EMAIL_HAS_ALREADY_EXISTED");
    }

    UserEntity userEntity = userMapper.toEntity(request);
    userEntity.setUsername(request.getUsername());
    userEntity.setEmail(request.getEmail());
    userEntity.setPassword(bCryptPasswordEncoder.encode(request.getPassword()));

    if (request.getFullName() != null)
      userEntity.setFullName(request.getFullName());

    if (request.getDob() != null)
      userEntity.setDob(request.getDob());

    if (request.getPhoneNumber() != null)
      userEntity.setPhoneNumber(request.getPhoneNumber());

    // Lưu user trước
    UserEntity saved = userRepository.save(userEntity);

    // Lưu user role
    Role customerRole = roleRepository.findById(Long.valueOf(UserRoleConstant.CUSTOMER.getCode()))
                                      .orElseThrow(() -> new RuntimeException("CUSTOMER_ROLE_NOT_FOUND!"));;
    UserRole userRole = new UserRole();
    userRole.setRole(customerRole);
    userRole.setUserEntity(userEntity);  
    userRoleRepository.save(userRole);
    
    // Tạo ví gắn user ngay lập tức
    Wallet wallet = Wallet.builder()
        .userEntity(saved)
        .balance(STAFF_WALLET_BALANCE)
        .build();
    walletRepository.save(wallet);

    return userMapper.toRegisterUserResponse(saved);
  }

  @Override
  public RegisterUserResponse createUserRoleStaff(RegisterUserRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new RuntimeException("EMAIL_HAS_ALREADY_EXISTED");
    }

    UserEntity userEntity = userMapper.toEntity(request);
    userEntity.setUsername(request.getUsername());
    userEntity.setEmail(request.getEmail());
    userEntity.setPassword(bCryptPasswordEncoder.encode(request.getPassword()));

    // Lưu staff trước
    UserEntity saved = userRepository.save(userEntity);

    // Lưu staff role
    Role staffRole = roleRepository.findById(Long.valueOf(UserRoleConstant.STAFF.getCode()))
                                      .orElseThrow(() -> new RuntimeException("STAFF_ROLE_NOT_FOUND"));;
    UserRole userRole = new UserRole();
    userRole.setRole(staffRole);
    userRole.setUserEntity(userEntity);  
    userRoleRepository.save(userRole);
    
    // Tạo ví gắn user ngay lập tức
    Wallet wallet = Wallet.builder()
        .userEntity(saved)
        .balance(BigDecimal.ZERO)
        .build();
    walletRepository.save(wallet);

    return userMapper.toRegisterUserResponse(saved);
  }

  @Override
  public UserResponse updateUser(Long id, UserRequest updatedUser) {
    UserEntity currUser = userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("USER_NOT_FOUND"));

    // <select> return 0 if the <option> with value "" is chosen
    // set null to park branch if this happens
    if (updatedUser.getParkBranchId() != null && updatedUser.getParkBranchId() != 0) {
      ParkBranch pb = parkBranchRepository.findById(updatedUser.getParkBranchId())
          .orElseThrow(() -> new RuntimeException("PARK_BRANCH_NOT_FOUND"));
      currUser.setParkBranch(pb);      
    } else {
      currUser.setParkBranch(null);
    }

    if (updatedUser.getUsername() != null)
      currUser.setUsername(updatedUser.getUsername());

    // if email is the same does not update email
    // if new email exists in db throw error
    if (updatedUser.getEmail() != null && !updatedUser.getEmail().equals(currUser.getEmail())) {
      if (userRepository.existsByEmail(updatedUser.getEmail())) {
        throw new RuntimeException("EMAIL_HAS_ALREADY_EXISTED");
      }
      
      currUser.setEmail(updatedUser.getEmail());
    }      

    // ### still wrong
    if (updatedUser.getPassword() != null)  
      currUser.setPassword(bCryptPasswordEncoder.encode(updatedUser.getPassword()));

    if (updatedUser.getFullName() != null)
      currUser.setFullName(updatedUser.getFullName());

    if (updatedUser.getDob() != null)
      currUser.setDob(updatedUser.getDob());

    if (updatedUser.getPhoneNumber() != null)
      currUser.setPhoneNumber(updatedUser.getPhoneNumber());

    UserEntity saved = userRepository.save(currUser);

    return userMapper.toUserDetailResponse(saved);
  }

  @Override
  public void deleteUser(Long id) {
    userRepository.deleteById(id);
  }

  @Override
  public LoginResponse login(LoginRequest request) {
    UserEntity userEntity = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new RuntimeException("USER_NOT_FOUND"));

    if (bCryptPasswordEncoder.matches(request.getPassword(), userEntity.getPassword())) {
      return LoginResponse.builder()
          .accessToken(jwtTokenUtils.generateAccessToken(userEntity))
          .build();
    }

    throw new RuntimeException("PASSWORD_INCORRECT");
  }

  @Override
  public UserResponse getUserDetail(Long id) {
    UserEntity userEntity = findUserById(id)
        .orElseThrow(() -> new UserNotFoundException(id));

    List<UserRole> userRoles = userRoleRepository.findAllByUserEntityId(id);
    if (userRoles.isEmpty()) throw new RuntimeException("USER_DOES_NOT_HAVE_ROLE");

    UserResponse response = userMapper.toUserDetailResponse(userEntity);
    response.setRoles(userRoleMapper.toResponseList(userRoles));

    return response;
  }

  @Override
  public List<UserResponse> getAllUsersDetail() {
    List<UserEntity> users = getAllUsers();

    List<UserResponse> responses = new ArrayList<>();
    for (UserEntity user : users) {
        UserResponse response = getUserDetail(user.getId());
        responses.add(response);
    }

    return responses;
  }

  @Override
  public boolean havePermission(String username, String roleAdmin, String permission) {
    return userRepository.havePermission(username, roleAdmin, permission);
  }
}
