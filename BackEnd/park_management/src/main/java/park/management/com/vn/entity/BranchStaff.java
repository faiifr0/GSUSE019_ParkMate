package park.management.com.vn.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import park.management.com.vn.entity.base.BaseEntity;

@Entity
@Table(name = "branch_staff")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class BranchStaff extends BaseEntity {

    @Column(name = "role")
    private String role;

    @ManyToOne(fetch = FetchType.LAZY)
    private Users user;

    @ManyToOne(fetch = FetchType.LAZY)
    private ParkBranch parkBranch;

    public BranchStaff(Integer id) {
        this.id = id;
    }
}

