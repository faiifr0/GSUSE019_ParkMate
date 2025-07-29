package park.management.com.vn.exception.user;

import park.management.com.vn.exception.BaseException;
import park.management.com.vn.exception.ErrorCode;

public abstract class UserException extends BaseException {

    public UserException(String message, ErrorCode errorCode) {
        super(message, errorCode);
    }
}
