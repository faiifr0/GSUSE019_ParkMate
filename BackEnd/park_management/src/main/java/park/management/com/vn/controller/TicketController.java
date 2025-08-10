package park.management.com.vn.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import park.management.com.vn.model.request.TicketRequest;
import park.management.com.vn.model.response.TicketResponse;
import park.management.com.vn.security.UserPrincipal;
import park.management.com.vn.service.TicketService;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping
    public ResponseEntity<TicketResponse> create(@RequestBody @Valid TicketRequest ticketRequest,
                                                 @AuthenticationPrincipal UserPrincipal user) {
        Long userId = user.getId();

        return ResponseEntity.ok(
                ticketService.getTicketResponseById(
                        ticketService.createTicketOrder(ticketRequest, userId)
                ));
    }


}
