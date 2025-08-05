package park.management.com.vn.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import park.management.com.vn.model.request.TransactionRecordRequest;
import park.management.com.vn.model.response.TransactionRecordResponse;
import park.management.com.vn.service.TransactionRecordService;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionRecordController {

    private final TransactionRecordService service;

    @PostMapping
    public ResponseEntity<TransactionRecordResponse> createTransaction(@Valid @RequestBody TransactionRecordRequest request) {
        return ResponseEntity.ok(service.createTransaction(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionRecordResponse> getTransactionById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getTransactionById(id));
    }

    @GetMapping
    public ResponseEntity<List<TransactionRecordResponse>> getAllTransactions() {
        return ResponseEntity.ok(service.getAllTransactions());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionRecordResponse> updateTransaction(@PathVariable Long id, @Valid @RequestBody TransactionRecordRequest request) {
        return ResponseEntity.ok(service.updateTransaction(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        service.deleteTransactionById(id);
        return ResponseEntity.noContent().build();
    }
}