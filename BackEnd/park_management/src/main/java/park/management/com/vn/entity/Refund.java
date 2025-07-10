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
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import park.management.com.vn.entity.base.BaseEntity;

@Entity
@Table(name = "refunds")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Refund extends BaseEntity {


  @ManyToOne
  @JoinColumn(name = "order_id")
  private TicketOrder order;

  @Column(name = "request_time")
  private LocalDateTime requestTime;

  @Column(name = "approved")
  private Boolean approved;

  @Column(name = "refund_amount")
  private BigDecimal refundAmount;

  @Column(name = "reason")
  private String reason;
}
