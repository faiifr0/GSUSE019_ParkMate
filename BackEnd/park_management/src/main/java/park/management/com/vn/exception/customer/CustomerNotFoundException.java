package park.management.com.vn.exception.customer;

import park.management.com.vn.exception.ErrorCode;

public class CustomerNotFoundException extends CustomerException {

    public CustomerNotFoundException(Long id) {
        super("Customer not found with id: " + id, ErrorCode.CUSTOMER_NOT_FOUND);
    }
}
