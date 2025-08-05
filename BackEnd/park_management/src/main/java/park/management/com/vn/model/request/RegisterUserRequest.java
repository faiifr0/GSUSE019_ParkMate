package park.management.com.vn.model.request;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter
@Getter
public class RegisterUserRequest {
  @NotNull
  private String email;
  @NotNull
  private String password;
}
