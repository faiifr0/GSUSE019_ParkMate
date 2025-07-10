package park.management.com.vn.config.model;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "jwt")
public class JWTConfigModel {

  private String secret;
  private Integer expireTime;
}
