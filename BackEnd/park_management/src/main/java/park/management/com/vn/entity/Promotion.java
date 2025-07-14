package park.management.com.vn.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "promotion")
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

  @Column(name = "discount")
  private BigDecimal discount;

  private Integer dayOfWeek; // Thứ trong tuần
  private Integer day; // Ngày trong tháng
  private Integer month; // Tháng

  @Column(name = "valid_from", nullable = false) // 20/05/2025
  private LocalDateTime from;

  @Column(name = "valid_until", nullable = false) // 26/05/2025
  private LocalDateTime to;

  @Column(name = "is_active")
  private Integer isActive;
}
