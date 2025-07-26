package park.management.com.vn.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import park.management.com.vn.entity.base.BaseEntity;

@Entity
@Table(name = "wallet")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Wallet extends BaseEntity {
    @Column(name = "balance")
    private double balance;

    @OneToOne
    @JoinColumn(name = "user_id")
    private Users user;
}
