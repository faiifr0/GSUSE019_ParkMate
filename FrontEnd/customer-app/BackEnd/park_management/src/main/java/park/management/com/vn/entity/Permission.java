package park.management.com.vn.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import park.management.com.vn.entity.base.BaseEntity;
import lombok.*;
import jakarta.persistence.*;


@Entity
@Table(name = "permission")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Permission extends BaseEntity {

  @Column(nullable = false, unique = true, length = 200)
  private String name;

  @Column(name = "description", length = 500)
  private String description;
}
