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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import park.management.com.vn.entity.base.BaseEntity;

@Entity
@Table(name = "ticket_prices")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TicketPrice extends BaseEntity {


  @ManyToOne
  @JoinColumn(name = "ticket_id")
  private Ticket ticket;

  @Column(name = "day_of_week")
  private Integer dayOfWeek;

  @Column(name = "dynamic_price")
  private BigDecimal dynamicPrice;
}
