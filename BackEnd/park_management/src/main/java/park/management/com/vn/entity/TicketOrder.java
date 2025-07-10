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
@Table(name = "ticket_orders")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TicketOrder extends BaseEntity {


  @ManyToOne
  @JoinColumn(name = "customer_id")
  private Customer customer;

  @ManyToOne
  @JoinColumn(name = "ticket_id")
  private Ticket ticket;

  @ManyToOne
  @JoinColumn(name = "branch_id")
  private ParkBranch branch;

  @Column(name = "quantity")
  private Integer quantity;

  @Column(name = "total_price")
  private BigDecimal totalPrice;

  @Column(name = "purchase_date")
  private LocalDateTime purchaseDate;

  @Column(name = "status")
  private String status;

  @Column(name = "guest_email")
  private String guestEmail;

  @Column(name = "guest_phone")
  private String guestPhone;
}
