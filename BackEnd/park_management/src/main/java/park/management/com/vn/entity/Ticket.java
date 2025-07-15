package park.management.com.vn.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import park.management.com.vn.constaint.EventStatus;
import park.management.com.vn.constaint.TicketStatus;
import park.management.com.vn.entity.base.BaseEntity;

@Entity
@Table(name = "ticket")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Ticket extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY)
  private Customer customer;

  @ManyToOne
  @JoinColumn(name = "park_branch_id")
  private ParkBranch parkBranch;

  @Enumerated(EnumType.STRING)
  private TicketStatus status;
}
