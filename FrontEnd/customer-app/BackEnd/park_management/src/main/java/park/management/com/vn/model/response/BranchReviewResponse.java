package park.management.com.vn.model.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Builder
@Setter
@Getter

public class BranchReviewResponse {
    private Long id;
    private Long userId;
    private String email;
    private Long branchId;
    private Integer rating;
    private String comment;
    private Boolean approved;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
