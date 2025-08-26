package park.management.com.vn.model.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter
@Getter
public class LoginResponse {

  private Long id;
  private String email;
  private String roleName;

  private String accessToken;
}
