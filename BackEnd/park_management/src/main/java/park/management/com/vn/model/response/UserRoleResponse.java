package park.management.com.vn.model.response;

import javax.management.relation.Role;

import lombok.Data;

@Data
public class UserRoleResponse {

    private Long id;

    private Long roleId;

    private String roleName;
    
}
