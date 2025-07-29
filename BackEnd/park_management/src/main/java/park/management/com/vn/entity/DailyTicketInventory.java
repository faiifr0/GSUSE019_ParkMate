package park.management.com.vn.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import park.management.com.vn.entity.base.BaseEntity;

import java.time.LocalDate;

@Entity
@Table(name = "daily_ticket_inventory")
@Getter
@Setter
public class DailyTicketInventory extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "ticket_type_id")
    private TicketType ticketType;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private Integer totalAvailable;

    @Column(nullable = false)
    private Integer sold;
}
