package park.management.com.vn.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import park.management.com.vn.entity.Voucher;
import park.management.com.vn.model.request.VoucherRequest;
import park.management.com.vn.model.response.VoucherResponse;

@Mapper(componentModel = "spring")
public interface VoucherMapper {

  Voucher toEntity(VoucherRequest request);

  @Mapping(target = "parkBranchId", source = "parkBranch.id")
  VoucherResponse toResponse(Voucher entity);

}
