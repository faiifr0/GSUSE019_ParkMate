package park.management.com.vn.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import park.management.com.vn.entity.UserRole;
import park.management.com.vn.entity.Wallet;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {

  Integer deleteByUserEntityId(Long userId);
  List<UserRole> findAllByUserEntityId(Long userId);

}
