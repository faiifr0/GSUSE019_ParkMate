package park.management.com.vn.service;

import java.math.BigDecimal;
import java.util.List;

import park.management.com.vn.entity.Voucher;
import park.management.com.vn.model.request.VoucherRequest;
import park.management.com.vn.model.response.VoucherResponse;

public interface VoucherService {

    /**
     * Validate a voucher and compute discount.
     * @param code voucher code
     * @param userId nullable (for logged-in)
     * @param guestEmail nullable (for guest)
     * @param subtotal order subtotal BEFORE voucher
     * @return Discount result (amount + voucher entity)
     */
    Result validateAndPrice(String code, Long userId, String guestEmail, BigDecimal subtotal);

    /**
     * Record voucher usage when order is PAID.
     */
    void recordUsageIfNeeded(Long orderId, Long userId, String guestEmail, Voucher voucher);

    record Result(BigDecimal discountAmount, Voucher voucher) {}

    VoucherResponse getVoucherById(Long id);

    List<VoucherResponse> getAllVouchers();

    VoucherResponse createVoucher(VoucherRequest request);

    VoucherResponse updateVoucher(Long id, VoucherRequest request);

    void deleteVoucherById(Long id);
}
