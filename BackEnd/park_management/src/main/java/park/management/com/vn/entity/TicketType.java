package park.management.com.vn.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import park.management.com.vn.entity.base.BaseEntity;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;


@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ticket_type")
public class TicketType extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    @Column(nullable = false)
    private BigDecimal basePrice;

    private Boolean isCancelable; // default true if null

    // e.g., morning/afternoon/evening slot (optional)
    private LocalTime startTime;
    private LocalTime endTime;
}
