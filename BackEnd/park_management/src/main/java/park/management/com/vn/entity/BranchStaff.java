package park.management.com.vn.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import park.management.com.vn.entity.base.BaseEntity;

@Entity
@Table(name = "branch_staff")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BranchStaff extends BaseEntity {

    @Column(name = "role")
    private String role;

    @ManyToOne(fetch = FetchType.LAZY)
    private Users user;

    @ManyToOne(fetch = FetchType.LAZY)
    private ParkBranch parkBranch;
}

