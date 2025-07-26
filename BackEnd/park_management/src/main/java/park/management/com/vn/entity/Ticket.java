package park.management.com.vn.entity;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
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
  private TicketType ticketType;

  @ManyToOne
  @JoinColumn(name = "ticket_detail_id")
  private TicketDetail ticketDetail;

  @Enumerated(EnumType.STRING)
  private TicketStatus status;
}
