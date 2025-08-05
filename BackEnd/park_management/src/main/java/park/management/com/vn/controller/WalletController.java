package park.management.com.vn.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import park.management.com.vn.model.request.WalletRequest;
import park.management.com.vn.model.response.WalletResponse;
import park.management.com.vn.service.WalletService;

import java.util.List;

@RestController
@RequestMapping("/api/wallets")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService service;

    @PostMapping
    public ResponseEntity<WalletResponse> createWallet(@Valid @RequestBody WalletRequest request) {
        return ResponseEntity.ok(service.createWallet(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WalletResponse> getWalletById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getWalletById(id));
    }

    @GetMapping
    public ResponseEntity<List<WalletResponse>> getAllWallets() {
        return ResponseEntity.ok(service.getAllWallets());
    }

    @PutMapping("/{id}")
    public ResponseEntity<WalletResponse> updateWallet(@PathVariable Long id, @Valid @RequestBody WalletRequest request) {
        return ResponseEntity.ok(service.updateWallet(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWallet(@PathVariable Long id) {
        service.deleteWalletById(id);
        return ResponseEntity.noContent().build();
    }
}
