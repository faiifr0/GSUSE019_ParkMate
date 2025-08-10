package park.management.com.vn.model.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Builder
@Setter
@Getter
public class WalletResponse {

    private Long id;
    private double balance;
    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
