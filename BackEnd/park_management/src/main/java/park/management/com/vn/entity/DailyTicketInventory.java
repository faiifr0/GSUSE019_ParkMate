package park.management.com.vn.entity;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;
import park.management.com.vn.entity.base.BaseEntity;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "daily_ticket_inventory",
        uniqueConstraints = @UniqueConstraint(columnNames = {"ticket_type_id", "date"}))
public class DailyTicketInventory extends BaseEntity {

    @Version
    @Column(nullable = false)
    private Long version;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_type_id")
    private TicketType ticketType;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false, name = "total_available")
    private Integer capacity;

    @Column(nullable = false)
    private Integer sold;

    // Defaults for *new* inserts (won’t change existing rows)
    @PrePersist
    void prePersist() {
        if (version == null)  version = 0L;   // Hibernate will then manage increments
        if (sold == null)     sold = 0;
        if (capacity == null) capacity = 0;
    }
}
