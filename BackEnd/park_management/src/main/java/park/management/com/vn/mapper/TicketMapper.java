package park.management.com.vn.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;
import park.management.com.vn.entity.Ticket;
import park.management.com.vn.entity.TicketDetail;
import park.management.com.vn.model.response.TicketDetailsResponse;
import park.management.com.vn.model.response.TicketResponse;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TicketMapper {

    @Mapping(target = "ticketId", source = "ticket.id", qualifiedByName = "convertId")
    @Mapping(target = "status", source = "ticket.status")
    @Mapping(target = "details", source = "ticketDetails")
    TicketResponse toResponse(Ticket ticket, List<TicketDetail> ticketDetails);

    @Mapping(target = "price", source = "price")
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "discount", source = "discount")
    TicketDetailsResponse toDetailResponse(TicketDetail detail);

    @Named("convertId")
    static Long convertId(Integer id) {
        return id != null ? id.longValue() : null;
    }
}
