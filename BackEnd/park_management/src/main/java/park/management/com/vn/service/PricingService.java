package park.management.com.vn.service;

import park.management.com.vn.entity.PriceInfo;
import park.management.com.vn.repository.TicketPriceRepository;

import java.math.BigDecimal;

public interface PricingService {


    PriceInfo getCurrentTicketPriceInfo();

    BigDecimal getCurrentTicketPrice();
}
