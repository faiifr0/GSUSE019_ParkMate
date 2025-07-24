package park.management.com.vn.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import park.management.com.vn.entity.Ticket;
import park.management.com.vn.model.request.TicketRequest;
import park.management.com.vn.model.response.TicketResponse;
import park.management.com.vn.service.TicketService;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

  private final TicketService ticketService;

  @GetMapping
  public ResponseEntity<List<Ticket>> getAllTickets() {
    return ResponseEntity.ok(ticketService.getAllTickets());
  }

  @GetMapping("/{id}")
  // @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<TicketResponse> getTicketById(@PathVariable Long id) {
    TicketResponse response = ticketService.getTicketResponseByID(id);
    return ResponseEntity.ok(response);
  }

  @PostMapping
  public ResponseEntity<Ticket> createTicket(@RequestBody Ticket ticket) {
    return ResponseEntity.ok(ticketService.createTicket(ticket));
  }

  @PutMapping("/{id}")
  public ResponseEntity<Ticket> updateTicket(@PathVariable Long id, @RequestBody Ticket ticket) {
    return ResponseEntity.ok(ticketService.updateTicket(id, ticket));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
    ticketService.deleteTicket(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/branch/{branchId}")
  public ResponseEntity<List<Ticket>> getTicketsByBranch(@PathVariable Long branchId) {
    return ResponseEntity.ok(ticketService.getTicketsByBranchId(branchId));
  }

  //tungnd
  @PostMapping("/buy")
  public ResponseEntity<TicketResponse> buyTicket(@RequestBody TicketRequest request) {
    TicketResponse response = ticketService.createTicketFromRequest(request);
    return ResponseEntity.ok(response);
  }

  @PutMapping("/{id}/approve")
  //@PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<TicketResponse> approveTicket(@PathVariable Long id) {
    TicketResponse response = ticketService.approveTicket(id);
    return ResponseEntity.ok(response);
  }


}
