package park.management.com.vn.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import park.management.com.vn.entity.VoucherUsage;

public interface VoucherUsageRepository extends JpaRepository<VoucherUsage, Long> {

    long countByVoucher_CodeIgnoreCaseAndUserId(String code, Long userId);

    long countByVoucher_CodeIgnoreCaseAndGuestEmailIgnoreCase(String code, String guestEmail);

    long countByVoucher_CodeIgnoreCase(String code); // for checking if voucher was used before

    boolean existsByOrderId(Long orderId); // avoid double-recording
}
