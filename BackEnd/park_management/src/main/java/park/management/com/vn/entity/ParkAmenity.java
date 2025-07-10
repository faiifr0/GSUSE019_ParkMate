package park.management.com.vn.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import park.management.com.vn.entity.base.BaseEntity;

@Entity
@Table(name = "park_amenities")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ParkAmenity extends BaseEntity {


  @ManyToOne
  @JoinColumn(name = "branch_id")
  private ParkBranch branch;

  @ManyToOne
  @JoinColumn(name = "amenity_id")
  private ParkAmenity amenity;

  @Column(name = "custom_description")
  private String customDescription;
}
