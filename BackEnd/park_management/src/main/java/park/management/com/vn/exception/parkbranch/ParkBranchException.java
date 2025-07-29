package park.management.com.vn.exception.parkbranch;

import park.management.com.vn.exception.BaseException;
import park.management.com.vn.exception.ErrorCode;

public abstract class ParkBranchException extends BaseException {
    public ParkBranchException(String message, ErrorCode errorCode) {
        super(message, errorCode);
    }
}
