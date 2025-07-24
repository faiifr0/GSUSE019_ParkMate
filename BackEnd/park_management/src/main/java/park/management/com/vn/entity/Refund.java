package park.management.com.vn.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import park.management.com.vn.entity.base.BaseEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "refund")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Refund extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    @Column(name = "request_time", nullable = false, updatable = false)
    private LocalDateTime requestTime;

    @Column(name = "approved", nullable = false)
    private boolean approved;

    @Column(name = "refund_amount", precision = 10, scale = 2)
    private BigDecimal refundAmount;

    @Column(name = "reason", length = 500)
    private String reason;
}
