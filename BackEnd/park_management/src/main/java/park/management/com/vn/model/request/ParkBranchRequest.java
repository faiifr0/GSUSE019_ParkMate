package park.management.com.vn.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Builder
@Setter
@Getter
public class ParkBranchRequest {

    @NotBlank
    private String name;

    private String address;

    private String location;

    @NotNull
    private LocalDateTime open;

    @NotNull
    private LocalDateTime close;

}
