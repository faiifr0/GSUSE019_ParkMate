package park.management.com.vn.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import park.management.com.vn.entity.base.BaseEntity;

@Entity
@Table(name = "ticket_type")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TicketType extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "price")
    private double price;

    @Column(name = "description")
    private String description;
}
