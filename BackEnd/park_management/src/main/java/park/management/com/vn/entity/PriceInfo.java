package park.management.com.vn.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import park.management.com.vn.constaint.PriceInfoConstant;
import park.management.com.vn.entity.base.BaseEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
