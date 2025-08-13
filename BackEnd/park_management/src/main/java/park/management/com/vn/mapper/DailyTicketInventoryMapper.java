package park.management.com.vn.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import park.management.com.vn.entity.DailyTicketInventory;
import park.management.com.vn.model.response.DailyTicketInventoryResponse;

@Mapper(componentModel = "spring")
public interface DailyTicketInventoryMapper {


    @Mapping(target = "ticketTypeId", source = "ticketType.id")
    @Mapping(target = "ticketTypeName", source = "ticketType.name")
    DailyTicketInventoryResponse toResponse(DailyTicketInventory entity);

}
