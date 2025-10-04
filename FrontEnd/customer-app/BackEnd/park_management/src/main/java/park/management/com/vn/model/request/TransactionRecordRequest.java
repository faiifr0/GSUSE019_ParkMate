package park.management.com.vn.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter
@Getter
public class TransactionRecordRequest {
    @NotNull
    private double amount;

    @NotBlank
    private String type;

    @NotNull
    private Long walletId;
}
