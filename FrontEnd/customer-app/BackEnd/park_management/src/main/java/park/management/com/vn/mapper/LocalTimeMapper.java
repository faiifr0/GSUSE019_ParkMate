package park.management.com.vn.mapper;

import org.springframework.stereotype.Component;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Component
public class LocalTimeMapper {
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("HH:mm:ss");

    public String asString(LocalTime time) {
        return time != null ? time.format(FORMATTER) : null;
    }

    public LocalTime asLocalTime(String time) {
        return time != null ? LocalTime.parse(time, FORMATTER) : null;
    }
}
