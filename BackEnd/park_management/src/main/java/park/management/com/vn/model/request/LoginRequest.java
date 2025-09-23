package park.management.com.vn.model.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.Data;

@Builder
@Setter
@Getter
public class LoginRequest {

  @NotBlank
  private String email;
  @NotBlank
  private String password;
}
