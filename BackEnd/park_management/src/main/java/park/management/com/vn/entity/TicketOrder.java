package park.management.com.vn.entity;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import park.management.com.vn.constant.OrderStatus;
import park.management.com.vn.entity.base.BaseEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "ticket_order")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor

public class TicketOrder extends BaseEntity {

  @ManyToOne(optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private Users user;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private OrderStatus status; // REQUESTED, PAID, CANCELLED, REFUNDED

  @Column(nullable = false)
  private BigDecimal totalAmount;

  private String paymentMethod;

  private LocalDateTime paymentTime;

  @OneToMany(mappedBy = "ticketOrder", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<TicketDetail> details;
}

