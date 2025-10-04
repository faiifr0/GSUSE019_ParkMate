package park.management.com.vn.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import park.management.com.vn.entity.WalletTopup;

import java.util.Optional;

@Repository
public interface WalletTopupRepository extends JpaRepository<WalletTopup, Long> {
  Optional<WalletTopup> findByPaymentLinkId(String paymentLinkId);
  Optional<WalletTopup> findByOrderCode(Long orderCode);
}
