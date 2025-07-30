package park.management.com.vn.model.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import park.management.com.vn.entity.Role;

import java.time.LocalDateTime;

@Builder
@Setter
@Getter
public class RoleResponse {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
