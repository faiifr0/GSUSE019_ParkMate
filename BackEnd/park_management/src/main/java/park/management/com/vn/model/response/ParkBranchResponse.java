package park.management.com.vn.model.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Builder
@Setter
@Getter
@lombok.Data
public class ParkBranchResponse {

    private Long id;
    private String name;
    private String address;
    private String location;
    private LocalTime openTime;
    private LocalTime closeTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean status;
}
