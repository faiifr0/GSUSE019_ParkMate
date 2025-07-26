package park.management.com.vn.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import park.management.com.vn.entity.base.BaseEntity;

@Entity
@Table(name = "branch_promotion")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BranchPromotion extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "branch_id")
  private ParkBranch branch;

  @Column(name = "description")
  private String description;

  @Column(name = "discount")
  private BigDecimal discount;

  @Column(name = "valid_from", nullable = false) // 20/05/2025
  private LocalDateTime from;

  @Column(name = "valid_until", nullable = false) // 26/05/2025
  private LocalDateTime to;

  @Column(name = "is_active")
  private Integer isActive;


}
