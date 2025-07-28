package park.management.com.vn.service;

import park.management.com.vn.model.request.ShiftRequest;
import park.management.com.vn.model.response.ShiftResponse;

import java.util.List;

public interface ShiftService {

    List<ShiftResponse> getAll();

    ShiftResponse create(ShiftRequest request);

    ShiftResponse getById(Integer id);

    ShiftResponse update(Integer id, ShiftRequest request);

    void delete(Integer id);
}
