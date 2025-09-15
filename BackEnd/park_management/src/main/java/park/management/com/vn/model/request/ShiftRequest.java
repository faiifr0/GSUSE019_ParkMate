package park.management.com.vn.model.request;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;
import lombok.Data;

@Builder
@Setter
@Getter

public class ShiftRequest {

    @NotNull
    private LocalTime startTime;

    @NotNull
    private LocalTime endTime;

    @NotNull
    private String description;
}
