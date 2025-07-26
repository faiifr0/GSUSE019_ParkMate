package park.management.com.vn.model.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter
@Getter
public class RoleRequest {
    private String name;
    private String description;
}
