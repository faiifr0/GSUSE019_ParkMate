package park.management.com.vn.mapper;


import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import park.management.com.vn.entity.OrderRefund;
import park.management.com.vn.model.response.RefundResponse;

@Mapper(componentModel = "spring")
public interface RefundMapper {
  @Mapping(target = "refundId", source = "id")
  @Mapping(target = "orderId", source = "order.id")
  @Mapping(target = "createdAt", source = "entity.createdAt")
  RefundResponse toResponse(OrderRefund entity);
}
