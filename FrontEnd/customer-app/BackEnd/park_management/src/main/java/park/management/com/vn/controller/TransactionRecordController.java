package park.management.com.vn.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import park.management.com.vn.model.request.TransactionRecordRequest;
import park.management.com.vn.model.response.TransactionRecordResponse;
import park.management.com.vn.security.UserPrincipal;
import park.management.com.vn.service.TransactionRecordService;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionRecordController {

    private final TransactionRecordService transactionRecordService;

    @PostMapping
    public ResponseEntity<TransactionRecordResponse> createTransaction(@Valid @RequestBody TransactionRecordRequest request) {
        return ResponseEntity.ok(transactionRecordService.createTransaction(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionRecordResponse> getTransactionById(@PathVariable Long id) {
        return ResponseEntity.ok(transactionRecordService.getTransactionById(id));
    }

    @GetMapping
    public ResponseEntity<List<TransactionRecordResponse>> getAllTransactions() {
        return ResponseEntity.ok(transactionRecordService.getAllTransactions());
    }

    @GetMapping("/of-user")
    public ResponseEntity<List<TransactionRecordResponse>> getTransactionsOfUser(@AuthenticationPrincipal UserPrincipal user) {        
        Long userId = (user != null) ? user.getId() : null;

        if (userId == null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();

        List<TransactionRecordResponse> response = transactionRecordService.getTransactionsOfUser(userId);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionRecordResponse> updateTransaction(@PathVariable Long id, @Valid @RequestBody TransactionRecordRequest request) {
        return ResponseEntity.ok(transactionRecordService.updateTransaction(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        transactionRecordService.deleteTransactionById(id);
        return ResponseEntity.noContent().build();
    }
}