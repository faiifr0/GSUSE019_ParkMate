package park.management.com.vn.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import park.management.com.vn.entity.ParkBranch;
import park.management.com.vn.entity.Voucher;
import park.management.com.vn.entity.VoucherUsage;
import park.management.com.vn.mapper.VoucherMapper;
import park.management.com.vn.model.request.VoucherRequest;
import park.management.com.vn.model.response.VoucherResponse;
import park.management.com.vn.repository.ParkBranchRepository;
import park.management.com.vn.repository.VoucherRepository;
import park.management.com.vn.repository.VoucherUsageRepository;
import park.management.com.vn.service.VoucherService;

@Service
@RequiredArgsConstructor
public class VoucherServiceImpl implements VoucherService {

    private static final ZoneId HCMC = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final BigDecimal MAX_LIMIT = new BigDecimal("500000");
    private static final BigDecimal HALF = new BigDecimal("0.5");

    private final VoucherRepository voucherRepo;
    private final VoucherUsageRepository usageRepo;
    private final ParkBranchRepository parkBranchRepo;
    private final VoucherMapper mapper;    

    @Override
    @Transactional
    public Result validateAndPrice(String code, Long userId, String guestEmail, BigDecimal subtotal) {
        if (code == null || code.isBlank()) return new Result(BigDecimal.ZERO, null);

        Voucher v = voucherRepo.findByCodeIgnoreCase(code.trim())
                .orElseThrow(() -> new IllegalArgumentException("VOUCHER_NOT_FOUND"));

        // active + within time window
        var now = LocalDateTime.now(HCMC);
        if (Boolean.FALSE.equals(v.getActive())) throw new IllegalStateException("VOUCHER_INACTIVE");
        if (now.isBefore(v.getStartAt()) || now.isAfter(v.getEndAt()))
            throw new IllegalStateException("VOUCHER_EXPIRED");

        // percent ≤ 0.5 & maxDiscount ≤ 500000 (defense-in-depth if DB constraints were bypassed)
        if (v.getPercent().compareTo(BigDecimal.ZERO) < 0 || v.getPercent().compareTo(HALF) > 0)
            throw new IllegalStateException("PERCENT_LIMIT_EXCEEDED");
        if (v.getMaxDiscount().compareTo(MAX_LIMIT) > 0)
            throw new IllegalStateException("MAX_DISCOUNT_LIMIT_EXCEEDED");

        // usage cap ≤ 3 per customer (by userId or guestEmail)
        long usedCount;
        if (userId != null) {
            usedCount = usageRepo.countByVoucher_CodeIgnoreCaseAndUserId(v.getCode(), userId);
        } else if (guestEmail != null && !guestEmail.isBlank()) {
            usedCount = usageRepo.countByVoucher_CodeIgnoreCaseAndGuestEmailIgnoreCase(v.getCode(), guestEmail.trim());
        } else {
            throw new IllegalStateException("IDENTITY_REQUIRED_FOR_VOUCHER");
        }
        if (usedCount >= 3) throw new IllegalStateException("VOUCHER_USAGE_LIMIT_REACHED");

        // compute discount = min(subtotal * percent, maxDiscount)
        BigDecimal byPercent = subtotal.multiply(v.getPercent());
        BigDecimal cap = v.getMaxDiscount().min(MAX_LIMIT); // extra guard
        BigDecimal discount = byPercent.min(cap);

        if (discount.signum() < 0) discount = BigDecimal.ZERO;
        return new Result(discount, v);
    }

    @Override
    @Transactional
    public void recordUsageIfNeeded(Long orderId, Long userId, String guestEmail, Voucher voucher) {
        if (voucher == null) return;
        if (usageRepo.existsByOrderId(orderId)) return;

        VoucherUsage u = new VoucherUsage();
        u.setVoucher(voucher);
        u.setUserId(userId);
        u.setGuestEmail(guestEmail);
        u.setOrderId(orderId);
        u.setUsedAt(LocalDateTime.now(HCMC));
        usageRepo.save(u);
    }

    @Override
    public VoucherResponse createVoucher(VoucherRequest request) {  
        ParkBranch pb = parkBranchRepo.findById(request.getParkBranchId())
                .orElseThrow(() -> new RuntimeException("Park Branch not found"));
        
        Voucher existVoucher = voucherRepo.findByCodeIgnoreCase(request.getCode()).orElse(null);
        if (existVoucher != null) new RuntimeException("Voucher Code already existed!");

        Voucher newVoucher = mapper.toEntity(request);
        newVoucher.setParkBranch(pb);
        return mapper.toResponse(voucherRepo.save(newVoucher));
    }

    @Override
    public VoucherResponse getVoucherById(Long id) {
        Voucher entity = voucherRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));
        return mapper.toResponse(entity);
    }

    @Override
    public List<VoucherResponse> getAllVouchers() {
        return voucherRepo.findAll().stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public VoucherResponse updateVoucher(Long id, VoucherRequest request) {
        Voucher existing = voucherRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));

        Voucher updated = mapper.toEntity(request);
        updated.setId(id);                
        
        // get from existingVoucher since voucher code maybe updated
        long voucherUsedCount = usageRepo.countByVoucher_CodeIgnoreCase(existing.getCode());
        if (voucherUsedCount == 0) {
            updated.setPercent(request.getPercent());
            updated.setMaxDiscount(request.getMaxDiscount());
            updated.setStartAt(request.getStartAt());
            updated.setEndAt(request.getEndAt());            
        }

        // active status can be updated whether its used before or not
        updated.setActive(request.getActive());
        updated.setParkBranch(existing.getParkBranch());

        return mapper.toResponse(voucherRepo.save(updated));
    }

    @Override
    public void deleteVoucherById(Long id) {
        Voucher existing = voucherRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Voucher not found"));

        // if voucher was used before it can't be deleted
        long voucherUsedCount = usageRepo.countByVoucher_CodeIgnoreCase(existing.getCode());
        if (voucherUsedCount > 0) voucherRepo.deleteById(id);        
    }
}
