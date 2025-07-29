package park.management.com.vn.exception.user;

import park.management.com.vn.exception.ErrorCode;

public class UserNotFoundException extends UserException {

    public UserNotFoundException(Long id) {
        super("User not found with id: " + id, ErrorCode.USER_NOT_FOUND);
    }
}
