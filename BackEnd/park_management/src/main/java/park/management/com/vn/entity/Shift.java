package park.management.com.vn.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import park.management.com.vn.entity.base.BaseEntity;

import java.time.LocalTime;

@Entity
@Table(name = "shift")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Shift extends BaseEntity {

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "description")
    private String description;

}
