package park.management.com.vn.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import park.management.com.vn.entity.Customer;
import park.management.com.vn.exception.customer.CustomerNotFoundException;
import park.management.com.vn.repository.CustomerRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    /*
     * Naming Convention:
     * - findX: May return null (or Optional), caller must handle missing case
     * - getX: Assumes the value must exist, throws exception if not found
     *
     * Use 'find' for tolerant/optional retrieval.
     * Use 'get' for strict/reliable retrieval with enforced presence.
     */


    @Override
    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(id));
    }

    @Override
    public Customer findCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElse(null);
    }


}
