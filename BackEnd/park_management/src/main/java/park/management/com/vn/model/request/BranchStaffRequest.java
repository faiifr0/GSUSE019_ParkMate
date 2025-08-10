package park.management.com.vn.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter
@Getter
public class BranchStaffRequest {
    @NotBlank
    private String role;

    @NotNull
    private Long userId;

    @NotNull
    private Long parkBranchId;

    @NotNull
    private String description;

}
