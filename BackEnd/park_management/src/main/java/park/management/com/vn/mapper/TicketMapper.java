package park.management.com.vn.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import park.management.com.vn.entity.TicketOrder;
import park.management.com.vn.entity.TicketDetail;
import park.management.com.vn.model.response.TicketDetailResponse;
import park.management.com.vn.model.response.TicketResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface TicketMapper {

    @Mapping(target = "orderId", source = "ticketOrder.id")
    @Mapping(target = "status", source = "ticketOrder.status")
    @Mapping(target = "details", expression = "java(toDetailResponseList(ticketDetails, ticketOrder.getTicketDate()))")    
    @Mapping(target = "finalAmount", source = "ticketOrder.finalAmount")
    @Mapping(target = "createdAt", source = "ticketOrder.createdAt")
    @Mapping(target = "parkBranchId", source = "ticketOrder.parkBranch.id")
    @Mapping(target = "parkBranchName", source = "ticketOrder.parkBranch.name")
    TicketResponse toResponse(TicketOrder ticketOrder, List<TicketDetail> ticketDetails);

    @Named("toDetailResponseListWithDate")
    default List<TicketDetailResponse> toDetailResponseList(List<TicketDetail> details, LocalDate ticketDate) {
        return details.stream()
                .map(detail -> {
                    TicketDetailResponse response = toDetailResponse(detail);
                    response.setTicketDate(ticketDate);
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Mapping(target = "ticketTypeId", source = "ticketType.id")
    @Mapping(target = "ticketTypeName", source = "ticketType.name")
    @Mapping(target = "price", source = "unitPrice")
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "discount", source = "discountPercent")
    @Mapping(target = "finalPrice", source = "finalPrice")
        // ticketDate is set manually in wrapper method above
    TicketDetailResponse toDetailResponse(TicketDetail detail);
}



