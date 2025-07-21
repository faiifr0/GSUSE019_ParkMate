package park.management.com.vn.service.impl;


import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import park.management.com.vn.constaint.PriceInfoConstant;
import park.management.com.vn.entity.Customer;
import park.management.com.vn.entity.ParkBranch;
import park.management.com.vn.entity.PriceInfo;
import park.management.com.vn.model.request.TicketItemRequest;
import park.management.com.vn.model.request.TicketRequest;
import park.management.com.vn.model.response.TicketDetailsResponse;
import park.management.com.vn.model.response.TicketResponse;
import park.management.com.vn.repository.*;
import park.management.com.vn.service.TicketService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@Rollback
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class TicketServiceIntegrationTest {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ParkBranchRepository parkBranchRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private TicketDetailRepository ticketDetailRepository;

    @Autowired
    private PriceInfoRepository priceInfoRepository;

    @Test
    void createTicketFromRequest_shouldSaveTicketAndDetails() {
        // === Setup Phase ===

        // 1. Seed a price info record for the ticket pricing logic to pick up
        PriceInfo priceInfo = new PriceInfo();
        priceInfo.setPriceInfoConstant(PriceInfoConstant.TICKET);
        priceInfo.setFromDate(LocalDateTime.now().minusDays(1)); // started yesterday
        priceInfo.setToDate(LocalDateTime.now().plusDays(1));    // still valid tomorrow
        priceInfo.setPrice(BigDecimal.valueOf(150_000));
        priceInfoRepository.save(priceInfo);

        // 2. Create and save a test customer
        Customer customer = new Customer();
        customer.setFullName("Test Customer");
        customer.setEmail("testcusstomer@example.com");
        customer.setPhone("0123456789");
        customer.setIsGuest(false);
        customer.setUsername("testcustomer");
        customer.setPassword("password");
        customer.setLoyaltyPoints(100);
        Customer savedCustomer = customerRepository.save(customer);

        // 3. Create and save a test park branch
        ParkBranch branch = new ParkBranch();
        branch.setName("Branch 1");
        branch.setAddress("123 Main Street");
        branch.setOpen(LocalDateTime.of(2025, 7, 20, 8, 0));
        branch.setClose(LocalDateTime.of(2025, 7, 20, 22, 0));
        ParkBranch savedParkBranch = parkBranchRepository.save(branch);

        // 4. Build a TicketRequest with one item of quantity 2
        TicketItemRequest item = new TicketItemRequest();
        item.setQuantity(2);
        TicketRequest request = new TicketRequest();
        request.setCustomerId(savedCustomer.getId().longValue());
        request.setParkBranchId(savedParkBranch.getId().longValue());
        request.setTicketItemRequests(List.of(item));

        // === Act Phase ===

        // 5. Invoke service method to create ticket and related ticket details
        TicketResponse response = ticketService.createTicketFromRequest(request);

        // === Assert Phase ===

        // 6. Verify response is returned and matches expected structure and data
        assertNotNull(response);
        assertEquals("REQUEST_TIME", response.getStatus());       // ticket status should be REQUEST_TIME
        assertEquals(1, response.getDetails().size());            // one detail record expected

        TicketDetailsResponse detail = response.getDetails().get(0);

        // 7. Verify ticket detail fields
        assertEquals(2, detail.getQuantity());                    // quantity from request
        assertEquals(0, detail.getPrice().compareTo(new BigDecimal("150000"))); // match seeded price
        assertEquals(0, detail.getDiscount().compareTo(BigDecimal.ZERO));       // no promotion means 0
    }

}
