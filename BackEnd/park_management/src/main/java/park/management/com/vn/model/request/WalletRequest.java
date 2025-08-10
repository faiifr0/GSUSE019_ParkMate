package park.management.com.vn.model.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter
@Getter
public class WalletRequest {

    @NotNull
    private Long userId;

    @DecimalMin(value = "0.0", message = "Balance must be a positive number")
    private double balance;
}
