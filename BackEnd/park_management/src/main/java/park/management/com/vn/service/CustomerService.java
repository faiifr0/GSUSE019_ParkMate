package park.management.com.vn.service;

import park.management.com.vn.entity.Customer;

import java.util.Optional;

public interface CustomerService {

    Customer getCustomerById(Long id);

    Optional<Customer> findCustomerById(Long id);

}
