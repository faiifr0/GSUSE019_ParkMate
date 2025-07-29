package park.management.com.vn.model.request;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Builder
@Setter
@Getter
public class StaffAssignmentRequest {
    @NotNull
    private LocalDate assignedDate;

    @NotNull
    private Integer staffId;

    @NotNull
    private Integer shiftId;
}
