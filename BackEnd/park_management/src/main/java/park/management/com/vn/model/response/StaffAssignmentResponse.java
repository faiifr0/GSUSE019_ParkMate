package park.management.com.vn.model.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
@Setter
@Getter
public class StaffAssignmentResponse {
    private Long id;
    private String staffName;
    private String shiftCode;
    private LocalDate assignedDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
