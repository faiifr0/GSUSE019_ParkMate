package park.management.com.vn.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import park.management.com.vn.entity.base.BaseEntity;

@Entity
@Table(name = "customer_review")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerReview extends BaseEntity {


  @ManyToOne
  @JoinColumn(name = "customer_id")
  private Customer customer;

  @ManyToOne
  @JoinColumn(name = "branch_id")
  private ParkBranch branch;

  @Column(name = "rating")
  private Integer rating;

  @Column(name = "comment")
  private String comment;

  @Column(name = "approved")
  private Boolean approved;
}
