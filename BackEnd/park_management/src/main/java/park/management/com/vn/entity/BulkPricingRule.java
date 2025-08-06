package park.management.com.vn.entity;

import jakarta.persistence.*;
import lombok.Data;
import park.management.com.vn.entity.base.BaseEntity;

@Entity
@Table(name = "bulk_pricing_rule")
@Data
public class BulkPricingRule extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "ticket_type_id")
    private TicketType ticketType;

    @Column(nullable = false)
    private Integer minQuantity;

    @Column(nullable = false)
    private Integer discountPercent;


}
