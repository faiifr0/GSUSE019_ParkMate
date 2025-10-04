package park.management.com.vn.config;

import java.util.Optional;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import park.management.com.vn.security.UserPrincipal;

@Component
public class SecurityAuditorAware implements AuditorAware<String> {

  @Override
  public Optional<String> getCurrentAuditor() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      return Optional.empty();
    }

    Object principal = authentication.getPrincipal();

    if (principal instanceof String) {
      return Optional.of((String) principal);
    }

    if (principal instanceof UserPrincipal user) {
      return Optional.of(user.getUsername());
    }

    return Optional.empty();
  }
}
