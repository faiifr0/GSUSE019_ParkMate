package park.management.com.vn.model.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Builder
@Setter
@Getter
public class BranchStaffResponse {
    private Integer id;
    private String role;
    private String userFullName;
    private String parkBranchName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
