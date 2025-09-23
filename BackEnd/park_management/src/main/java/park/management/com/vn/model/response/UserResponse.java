package park.management.com.vn.model.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;
import park.management.com.vn.entity.ParkBranch;

@Data
public class UserResponse {

  private Long id;
  private String username;
  private String email;
  private ParkBranch parkBranch;
  private List<UserRoleResponse> roles;
  private Long walletId;
  private BigDecimal balance;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private String fullName;
  private String phoneNumber;
  private LocalDate dob;
}
