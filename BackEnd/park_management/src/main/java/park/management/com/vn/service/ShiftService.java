package park.management.com.vn.service;

import park.management.com.vn.model.request.ShiftRequest;
import park.management.com.vn.model.response.ShiftResponse;

import java.util.List;

public interface ShiftService {

    List<ShiftResponse> getAll();

    ShiftResponse create(ShiftRequest request);

    ShiftResponse getById(Long id);

    ShiftResponse update(Long id, ShiftRequest request);

    void delete(Long id);
}
