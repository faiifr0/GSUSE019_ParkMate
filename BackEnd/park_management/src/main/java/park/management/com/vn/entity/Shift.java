package park.management.com.vn.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import park.management.com.vn.entity.base.BaseEntity;

import java.time.LocalTime;

@Entity
@Table(name = "shift")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Shift extends BaseEntity {

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;
    @Column(name = "description")
    private String description;

}
