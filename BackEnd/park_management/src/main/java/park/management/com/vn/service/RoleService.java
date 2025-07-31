package park.management.com.vn.service;

import park.management.com.vn.model.request.RoleRequest;
import park.management.com.vn.model.response.RoleResponse;

import java.util.List;

public interface RoleService {
    List<RoleResponse> getAllRole();

    RoleResponse createRole(RoleRequest request);

    RoleResponse updateRole(Long id, RoleRequest request);

    void deleteRole(Long id);
}
