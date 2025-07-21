package park.management.com.vn.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import park.management.com.vn.entity.PriceInfo;
import park.management.com.vn.exception.price.PriceNotFoundException;
import park.management.com.vn.repository.TicketPriceRepository;
import park.management.com.vn.specification.PriceInfoSpecification;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class PricingServiceImpl implements PricingService {

    private final TicketPriceRepository ticketPriceRepository;

    @Override
    public PriceInfo getCurrentTicketPriceInfo() {
        return ticketPriceRepository
                .findOne(PriceInfoSpecification.isCurrentTicketPrice())
                .orElseThrow(() -> new PriceNotFoundException("No valid listed price found"));
    }

    @Override
    public BigDecimal getCurrentTicketPrice() {
        return getCurrentTicketPriceInfo().getPrice();
    }
}
