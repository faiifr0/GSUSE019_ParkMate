package park.management.com.vn.model.response;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;

@Builder
@Data
public class StaffAssignmentResponse {
    private Long id;
    private String shiftId;
    private String staffName;    
    private LocalDate assignedDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime scanInAt;
    private LocalDateTime scanOutAt;
}
