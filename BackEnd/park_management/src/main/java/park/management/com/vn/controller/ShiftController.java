package park.management.com.vn.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import park.management.com.vn.model.request.ShiftRequest;
import park.management.com.vn.model.response.ShiftResponse;
import park.management.com.vn.service.ShiftService;

import java.util.List;

@RestController
@RequestMapping("/api/shift")
@RequiredArgsConstructor
public class ShiftController {

    private final ShiftService service;

    @PostMapping
    public ResponseEntity<ShiftResponse> createShift(@RequestBody @Valid ShiftRequest request) {
        return ResponseEntity.ok(service.createShift(request));
    }

    @GetMapping
    public ResponseEntity<List<ShiftResponse>> getAllShift() {
        return ResponseEntity.ok(service.getAllShift());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShiftResponse> getShiftById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getShiftById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShiftResponse> updateShift(@PathVariable Long id, @RequestBody @Valid ShiftRequest request) {
        return ResponseEntity.ok(service.updateShift(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShift(@PathVariable Long id) {
        service.deleteShift(id);
        return ResponseEntity.noContent().build();
    }
}
