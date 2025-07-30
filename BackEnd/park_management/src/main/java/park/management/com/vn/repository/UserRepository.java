package park.management.com.vn.repository;

import java.util.Optional;

import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import park.management.com.vn.entity.Users;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {

  Optional<Users> findByUsername(String username);

  boolean existsByEmail(String email);

}
