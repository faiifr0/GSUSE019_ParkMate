package park.management.com.vn.service;

import park.management.com.vn.entity.PriceInfo;

import java.math.BigDecimal;

public interface PricingService {


    PriceInfo getCurrentTicketPriceInfo();

    BigDecimal getCurrentTicketPrice();
}
