package park.management.com.vn.model.response;

import lombok.*;
import park.management.com.vn.entity.AmenityType;
import park.management.com.vn.entity.ParkBranch;

@Builder
@Setter
@Getter
@NoArgsConstructor @AllArgsConstructor

public class BranchAmenityResponse {

  private ParkBranch parkBranch;
  
  private AmenityType amenityType;
  
  private String name;

  private String description;

  private String imageUrl;

  private Boolean status;
}
