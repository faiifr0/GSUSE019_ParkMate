package park.management.com.vn.exception.parkbranch;

import park.management.com.vn.exception.ErrorCode;

public class ParkBranchNotFoundException extends ParkBranchException {
    public ParkBranchNotFoundException(Long id) {
        super("Park branch not found with id: " + id, ErrorCode.PARK_BRANCH_NOT_FOUND);
    }
}
