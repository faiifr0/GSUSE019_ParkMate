package park.management.com.vn.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import park.management.com.vn.entity.BranchReview;
import park.management.com.vn.model.request.BranchReviewRequest;
import park.management.com.vn.model.response.BranchReviewResponse;

@Mapper(componentModel = "spring")
public interface BranchReviewMapper {
    BranchReview toEntity(BranchReviewRequest request);

    @Mapping(target = "userId", source = "userEntity.id")
    @Mapping(target = "branchId", source = "parkBranch.id")
    @Mapping(target = "email", source = "userEntity.email")
    BranchReviewResponse toResponse(BranchReview entity);
}
