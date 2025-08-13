package park.management.com.vn.controller;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import park.management.com.vn.model.request.DailyTicketInventoryRequest;
import park.management.com.vn.model.response.DailyTicketInventoryResponse;
import park.management.com.vn.service.DailyTicketInventoryService;

@RestController
@RequestMapping("/api/daily-ticket-inventory")
@RequiredArgsConstructor
public class DailyTicketInventoryController {

    private final DailyTicketInventoryService dailyTicketInventoryService;

    @PostMapping
    public ResponseEntity<DailyTicketInventoryResponse> create(@RequestBody DailyTicketInventoryRequest request) {
        return ResponseEntity.ok(dailyTicketInventoryService.getDailyTicketInventoryResponseById(
                dailyTicketInventoryService.createDailyTicketInventory(request)
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DailyTicketInventoryResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(dailyTicketInventoryService.getDailyTicketInventoryResponseById(id));
    }



}
