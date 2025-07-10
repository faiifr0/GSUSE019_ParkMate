package park.management.com.vn.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import park.management.com.vn.entity.base.BaseEntity;

@Entity
@Table(name = "customers")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Customer extends BaseEntity {

  @Column(name = "full_name", nullable = false)
  private String fullName;

  @Column(name = "email", unique = true)
  private String email;

  @Column(name = "phone")
  private String phone;

  @Column(name = "is_guest")
  private Boolean isGuest;

  @Column(name = "registered_at")
  private LocalDateTime registeredAt;

  @Column(name = "username", unique = true)
  private String username;

  @Column(name = "password_hash")
  private String passwordHash;

  @Column(name = "loyalty_points")
  private Integer loyaltyPoints;
}
