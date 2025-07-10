package park.management.com.vn.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import park.management.com.vn.entity.base.BaseEntity;

@Entity
@Table(name = "promotions")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Promotion extends BaseEntity {


  @ManyToOne
  @JoinColumn(name = "branch_id")
  private ParkBranch branch;

  @Column(name = "code", nullable = false, unique = true)
  private String code;

  @Column(name = "description")
  private String description;

  @Column(name = "discount_percentage")
  private BigDecimal discountPercentage;

  @Column(name = "valid_from", nullable = false)
  private LocalDateTime validFrom;

  @Column(name = "valid_until", nullable = false)
  private LocalDateTime validUntil;

  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @Column(name = "updated_at")
  private LocalDateTime updatedAt;
}
