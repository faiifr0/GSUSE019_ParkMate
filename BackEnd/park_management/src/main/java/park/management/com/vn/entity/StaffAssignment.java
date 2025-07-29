package park.management.com.vn.entity;

import jakarta.persistence.*;
import lombok.*;
import park.management.com.vn.entity.base.BaseEntity;

import java.time.LocalDate;

@Entity
@Table(name = "staff_assignment")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class StaffAssignment extends BaseEntity {

    @Column(name = "assigned_date", nullable = false)
    private LocalDate assignedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    private BranchStaff staff;

    @ManyToOne(fetch = FetchType.LAZY)
    private Shift shift;
}
