package park.management.com.vn.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import park.management.com.vn.entity.Wallet;
import park.management.com.vn.mapper.WalletMapper;
import park.management.com.vn.model.request.WalletRequest;
import park.management.com.vn.model.response.WalletResponse;
import park.management.com.vn.repository.UserRepository;
import park.management.com.vn.repository.WalletRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;
    private final WalletMapper mapper;
    private final UserRepository usersRepository;

    @Override
    public WalletResponse createWallet(WalletRequest request) {
        Wallet wallet = mapper.toEntity(request);
        wallet.setUser(usersRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found")));
        return mapper.toResponse(walletRepository.save(wallet));
    }

    @Override
    public WalletResponse getWalletById(Long id) {
        Wallet wallet = walletRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        return mapper.toResponse(wallet);
    }

    @Override
    public List<WalletResponse> getAllWallets() {
        return walletRepository.findAll().stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public WalletResponse updateWallet(Long id, WalletRequest request) {
        Wallet existing = walletRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        Wallet updated = mapper.toEntity(request);
        updated.setId(id);
        updated.setCreatedAt(existing.getCreatedAt());
        updated.setCreatedBy(existing.getCreatedBy());
        return mapper.toResponse(walletRepository.save(updated));
    }

    @Override
    public void deleteWalletById(Long id) {
        walletRepository.deleteById(id);
    }
}
