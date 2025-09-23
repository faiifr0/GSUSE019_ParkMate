package park.management.com.vn.model.response;

import java.math.BigDecimal;
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
}
