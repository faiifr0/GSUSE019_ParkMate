package park.management.com.vn.model.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RegisterUserRequest {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 5, message = "Password must be at least 5 characters")
    private String password;

    @Size(max = 50, message = "Full name must not exceed 50 characters")
    private String fullName;

    @Pattern(regexp = "^0[3|5|7|8|9][0-9]{8}$", message = "Phone number must be a valid Vietnamese mobile number starting with 0")
    private String phoneNumber;

    @Past(message = "Date of birth must be in the past")
    private LocalDate dob;
}
