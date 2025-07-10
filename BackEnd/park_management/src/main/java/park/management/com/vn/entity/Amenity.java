package park.management.com.vn.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import park.management.com.vn.entity.base.BaseEntity;

@Entity
@Table(name = "amenities")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Amenity extends BaseEntity {

  @Column(name = "name", nullable = false, unique = true)
  private String name;

  @Column(name = "category")
  private String category;

  @Column(name = "default_description")
  private String defaultDescription;
}
