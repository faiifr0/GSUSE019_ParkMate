package park.management.com.vn.model.response;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
@Data
public class StaffAssignmentResponse {
    private Integer id;
    private LocalDate assignedDate;

    private Integer staffId;
    private String staffName;

    private Integer shiftId;
    private String shiftName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
