package park.management.com.vn.model.response;

import lombok.*;
import park.management.com.vn.entity.AmenityType;
import park.management.com.vn.entity.ParkBranch;

@Builder
@Setter
@Getter
@NoArgsConstructor @AllArgsConstructor

public class BranchAmenityResponse {
  private String id;

  private String parkBranchId;
  
  private String amenityTypeId;
  
  private String name;

  private String description;

  private String imageUrl;

  private Boolean status;
}
