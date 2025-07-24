package park.management.com.vn.entity;

import jakarta.persistence.*;
import lombok.*;
import park.management.com.vn.constaint.TicketStatus;
import park.management.com.vn.entity.base.BaseEntity;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ticket")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket extends BaseEntity {

  /*
  ticket_detail_type (or ticket_type or ticket_category)
    - id (PK)
    - name (e.g., 'Adult', 'Child', 'Student')
    - description
    - base_price (optional, for reference or fallback)
    - is_active (optional)
  ticket_detail:
    - id
    - ticket_id (FK)
    - quantity
    - price
    - discount
    - ticket_type_id (FK to ticket_detail_type)
  */

    @ManyToOne(fetch = FetchType.LAZY)
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "park_branch_id")
    private ParkBranch parkBranch;

    @Enumerated(EnumType.STRING)
    private TicketStatus status;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TicketDetail> ticketDetails = new ArrayList<>();


}
