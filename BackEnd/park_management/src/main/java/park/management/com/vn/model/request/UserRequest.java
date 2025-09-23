package park.management.com.vn.model.request;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Builder
@Setter
@Getter
public class UserRequest {
  
  private String username;

  private String email;

  private String password;

  private Long parkBranchId;

}
