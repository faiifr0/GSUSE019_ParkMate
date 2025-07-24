package park.management.com.vn.entity;

import jakarta.persistence.*;
import lombok.*;
import park.management.com.vn.entity.base.BaseEntity;

import java.math.BigDecimal;

@Entity
@Table(name = "ticket_detail")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketDetail extends BaseEntity {

  @ManyToOne
  @JoinColumn(name = "ticket_id")
  private Ticket ticket;

  @Column(name = "quantity")
  private Integer quantity;

  @Column(name = "price")
  private BigDecimal price;

  @Column(name = "discount")
  private BigDecimal discount;
}
