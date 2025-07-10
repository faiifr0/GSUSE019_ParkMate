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
@Table(name = "tickets")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Ticket extends BaseEntity {


  @ManyToOne
  @JoinColumn(name = "branch_id")
  private ParkBranch parkBranch;

  @ManyToOne
  @JoinColumn(name = "event_id")
  private Event event;

  @Column(name = "ticket_type", nullable = false)
  private String ticketType;

  @Column(name = "price", nullable = false)
  private BigDecimal price;

  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @Column(name = "updated_at")
  private LocalDateTime updatedAt;
}
