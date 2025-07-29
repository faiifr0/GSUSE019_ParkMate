package park.management.com.vn.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import park.management.com.vn.entity.TicketOrder;
import park.management.com.vn.entity.TicketDetail;
import park.management.com.vn.model.response.TicketDetailResponse;
import park.management.com.vn.model.response.TicketResponse;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TicketMapper {

    @Mapping(target = "ticketId", source = "ticketOrder.id")
    @Mapping(target = "status", source = "ticketOrder.status")
    @Mapping(target = "details", source = "ticketDetails")
    TicketResponse toResponse(TicketOrder ticketOrder, List<TicketDetail> ticketDetails);

    @Mapping(target = "ticketTypeId", source = "ticketType.id")
    @Mapping(target = "ticketTypeName", source = "ticketType.name")
    @Mapping(target = "price", source = "unitPrice")
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "discount", source = "discountPercent")
    @Mapping(target = "finalPrice", source = "finalPrice")
    @Mapping(target = "ticketDate", source = "ticketDate")
    TicketDetailResponse toDetailResponse(TicketDetail detail);
}

