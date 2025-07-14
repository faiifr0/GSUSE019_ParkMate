package park.management.com.vn.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import park.management.com.vn.constaint.PriceInfoConstant;
import park.management.com.vn.entity.base.BaseEntity;

@Entity
@Table(name = "price_info")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PriceInfo extends BaseEntity {

  @Enumerated(EnumType.STRING)
  @Column(name = "price_info_constant")
  private PriceInfoConstant priceInfoConstant;

  private BigDecimal price;
  private LocalDateTime fromDate;
  private LocalDateTime toDate;
}
