package park.management.com.vn.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import park.management.com.vn.entity.base.BaseEntity;

@Entity
@Table(name = "customer")
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

  @Column(name = "username", unique = true)
  private String username;

  @Column(name = "password")
  private String password;

  @Column(name = "loyalty_points")
  private Integer loyaltyPoints;
}
