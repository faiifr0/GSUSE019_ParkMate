package park.management.com.vn.exception.price;
import park.management.com.vn.exception.ErrorCode;
public class PriceNotFoundException extends PriceException {
    public PriceNotFoundException(String message) {
        super(message, ErrorCode.PRICE_NOT_FOUND);
    }
}
