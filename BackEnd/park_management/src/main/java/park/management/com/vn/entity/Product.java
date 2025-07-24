package park.management.com.vn.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import park.management.com.vn.entity.base.BaseEntity;

@Entity
@Table(name = "product")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Product extends BaseEntity {

  private String name;
  private String description;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "amenity_id")
  private Amenity amenity;
}
