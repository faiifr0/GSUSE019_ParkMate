package park.management.com.vn.model.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ErrorResponse {

    // When the error happened
    private LocalDateTime timestamp;

    // HTTP status code
    private int status;

    // HTTP status name (example: "Not Found")
    private String error;

    // Human-readable explanation
    private String message;

    // Internal system error code
    private String errorCode;

}
