package park.management.com.vn.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import park.management.com.vn.entity.BranchReview;
import park.management.com.vn.model.request.BranchReviewRequest;
import park.management.com.vn.model.response.BranchReviewResponse;

@Mapper(componentModel = "spring")
public interface BranchReviewMapper {
    BranchReview toEntity(BranchReviewRequest request);

    @Mapping(target = "userId", source = "userEntity.username")
    @Mapping(target = "branchId", source = "parkBranch.name")
    BranchReviewResponse toResponse(BranchReview entity);
}
