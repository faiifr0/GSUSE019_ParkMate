package park.management.com.vn.controller;

import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import park.management.com.vn.entity.Users;
import park.management.com.vn.model.request.LoginRequest;
import park.management.com.vn.model.request.RegisterUserRequest;
import park.management.com.vn.model.request.UserRequest;
import park.management.com.vn.model.response.LoginResponse;
import park.management.com.vn.model.response.RegisterUserResponse;
import park.management.com.vn.service.UserService;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  @PostMapping("/register")
  public ResponseEntity<RegisterUserResponse> register(
      @RequestBody @Valid RegisterUserRequest request) {
    return ResponseEntity.ok(userService.createUser(request));
  }

  @PostMapping("/login")
  public ResponseEntity<LoginResponse> login(
      @RequestBody @Valid LoginRequest request) {
    return ResponseEntity.ok(userService.login(request));
  }

  @GetMapping
  public ResponseEntity<List<Users>> getAllUsers() {
    return ResponseEntity.ok(userService.getAllUsers());
  }

  @GetMapping("/{id}")
  public ResponseEntity<Users> getUserById(@PathVariable Long id) {
    return userService.findUserById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @PutMapping("/{id}")
  public ResponseEntity<Users> updateUser(@PathVariable Long id, @RequestBody UserRequest users) {
    return ResponseEntity.ok(userService.updateUser(id, users));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    userService.deleteUser(id);
    return ResponseEntity.noContent().build();
  }
}
