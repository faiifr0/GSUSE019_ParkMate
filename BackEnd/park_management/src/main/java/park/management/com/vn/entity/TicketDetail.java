package park.management.com.vn.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import park.management.com.vn.entity.base.BaseEntity;

@Entity
@Table(name = "ticket_detail")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TicketDetail extends BaseEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "ticket_order_id", nullable = false)
    private TicketOrder ticketOrder;

    @ManyToOne(optional = false)
    @JoinColumn(name = "ticket_type_id", nullable = false)
    private TicketType ticketType;

    @ManyToOne
    @JoinColumn(name = "promotion_id")
    private BranchPromotion promotion;

    @Column(nullable = false)
    private LocalDate ticketDate;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private BigDecimal unitPrice;

    private Integer discountPercent;

    @Column(nullable = false)
    private BigDecimal finalPrice; // (unit * quantity) - discount
}