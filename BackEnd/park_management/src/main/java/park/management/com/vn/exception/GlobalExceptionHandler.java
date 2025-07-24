package park.management.com.vn.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import park.management.com.vn.model.response.ErrorResponse;

import java.time.LocalDateTime;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ErrorResponse> handleBaseException(BaseException ex) {
        log.error("Handled BaseException: {}", ex.getMessage());

        ErrorResponse body = new ErrorResponse();
        body.setTimestamp(LocalDateTime.now());
        body.setStatus(ex.getStatus().value());
        body.setError(ex.getStatus().getReasonPhrase());
        body.setMessage(ex.getMessage());
        body.setErrorCode(ex.getErrorCode().getCode());

        return ResponseEntity.status(ex.getErrorCode().getStatus()).body(body);

    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex) {
        log.error("Handled Exception: {}", ex.getMessage());

        ErrorResponse body = new ErrorResponse();
        body.setTimestamp(LocalDateTime.now());
        body.setStatus(500);
        body.setMessage(ex.getMessage());
        body.setError("Internal Server Error");
        body.setErrorCode("INTERNAL_ERROR");

        return ResponseEntity.internalServerError().body(body);
    }

}
