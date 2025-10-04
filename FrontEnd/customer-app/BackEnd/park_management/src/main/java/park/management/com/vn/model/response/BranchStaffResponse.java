package park.management.com.vn.model.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Builder
@Setter
@Getter

public class BranchStaffResponse {
    private Long id;
    private Long userId;
    private String role;
    private String description;
    private String username;
    private String userFullName;
    private Long parkBranchId;
    private String parkBranchName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean status;
}
