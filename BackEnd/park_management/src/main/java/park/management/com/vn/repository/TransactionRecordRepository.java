package park.management.com.vn.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import park.management.com.vn.entity.TransactionRecord;

@Repository
public interface TransactionRecordRepository extends JpaRepository<TransactionRecord, Long> {
    Optional<TransactionRecord> findByWalletId(Long walletId);
}
