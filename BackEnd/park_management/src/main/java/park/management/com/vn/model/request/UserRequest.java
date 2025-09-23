package park.management.com.vn.model.request;

import java.time.LocalDate;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Builder
@Setter
@Getter
public class UserRequest {
  @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
  private String username;

  @Email(message = "Email should be valid")
  private String email;

  @Size(min = 5, message = "Password must be at least 5 characters")
  private String password;

  private Long parkBranchId;

  @Size(max = 50, message = "Full name must not exceed 50 characters")
  private String fullName;

  @Pattern(regexp = "^0[3|5|7|8|9][0-9]{8}$", message = "Phone number must be a valid Vietnamese mobile number starting with 0")
  private String phoneNumber;

  @Past(message = "Date of birth must be in the past")
  private LocalDate dob;
}
