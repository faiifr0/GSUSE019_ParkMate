package park.management.com.vn.mapper;

import org.mapstruct.Mapper;
import park.management.com.vn.entity.Wallet;
import park.management.com.vn.model.request.WalletRequest;
import park.management.com.vn.model.response.WalletResponse;

@Mapper(componentModel = "spring")
public interface WalletMapper {

    Wallet toEntity(WalletRequest request);

    WalletResponse toResponse(Wallet entity);
}