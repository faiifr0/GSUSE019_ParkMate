package park.management.com.vn.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.*;
import park.management.com.vn.entity.base.BaseEntity;

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
