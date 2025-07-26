package park.management.com.vn.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import park.management.com.vn.entity.base.BaseEntity;

@Entity
@Table(name = "ticket_detail")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TicketDetail extends BaseEntity {

  @Column(name = "quantity")
  private Integer quantity;

  @Column(name = "price")
  private BigDecimal price;

  @Column(name = "discount")
  private Integer discount;

  @ManyToOne(fetch = FetchType.LAZY)
  private Users user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "promotion_id")
  private BranchPromotion promotion;

  @OneToOne(mappedBy = "ticketOrder", cascade = CascadeType.ALL)
  private OrderRefund refund;

}
