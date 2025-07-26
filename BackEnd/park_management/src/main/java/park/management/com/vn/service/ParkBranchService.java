package park.management.com.vn.service;

import java.util.List;
import java.util.Optional;
import park.management.com.vn.entity.ParkBranch;
import park.management.com.vn.model.request.ParkBranchRequest;
import park.management.com.vn.model.response.ParkBranchResponse;

public interface ParkBranchService {

  List<ParkBranchResponse> getAll();

  ParkBranchResponse create(ParkBranchRequest request);

  ParkBranchResponse update(Integer id, ParkBranchRequest request);

  void delete(Integer id);
}
