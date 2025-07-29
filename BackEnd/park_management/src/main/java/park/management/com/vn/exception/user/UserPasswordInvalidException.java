package park.management.com.vn.exception.user;

import org.springframework.http.HttpStatus;
import park.management.com.vn.exception.ErrorCode;

public class UserPasswordInvalidException extends UserException {
    public UserPasswordInvalidException() {
        super("Incorrect user password", ErrorCode.USER_PASSWORD_INVALID);
    }

    public UserPasswordInvalidException(String message) {
      super(message, ErrorCode.USER_PASSWORD_INVALID);
    }
}
