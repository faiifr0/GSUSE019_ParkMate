package park.management.com.vn.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.access.expression.method.DefaultMethodSecurityExpressionHandler;
import org.springframework.security.access.expression.method.MethodSecurityExpressionHandler;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import java.util.List;

@Slf4j
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final AuthenticationFilter authenticationFilter;
  private final PermissionEvaluatorImpl permissionEvaluator;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    log.info("(securityFilterChain) start");

    http
      .csrf(AbstractHttpConfigurer::disable)
      .cors(Customizer.withDefaults())
      .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(auth -> auth
        // CORS preflight
        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

        // WebSocket handshake/info
        .requestMatchers("/ws/**").permitAll()

        // Swagger / OpenAPI
        .requestMatchers(
          "/swagger-ui.html",
          "/swagger-ui/**",
          "/v3/api-docs",
          "/v3/api-docs/**",
          "/v3/api-docs.yaml"
        ).permitAll()

        // Public endpoints (login/register + payment callbacks)
        .requestMatchers(
          "/public/**",
          "/api/users/login",
          "/api/users/register",
          "/api/payment/payos/webhook",
          "/api/local/topups/confirm",
          "/api/payment/payos/webhook/dev-complete/**"
        ).permitAll()

        // *** Public catalog & guest checkout ***
        .requestMatchers(HttpMethod.GET,  "/api/ticket-types/**").permitAll()
        .requestMatchers(HttpMethod.GET,  "/api/events/**").permitAll()
        .requestMatchers(HttpMethod.POST, "/api/orders").permitAll()

        // TEMP (until /api/orders is implemented): allow guest on legacy ticket creation
        .requestMatchers(HttpMethod.POST, "/api/tickets").permitAll()

        // Ticket types admin
        .requestMatchers(HttpMethod.POST,   "/api/ticket-types/**").hasAnyAuthority("MANAGER","ADMIN")
        .requestMatchers(HttpMethod.PUT,    "/api/ticket-types/**").hasAnyAuthority("MANAGER","ADMIN")
        .requestMatchers(HttpMethod.DELETE, "/api/ticket-types/**").hasAnyAuthority("MANAGER","ADMIN")

        // Events admin
        .requestMatchers(HttpMethod.POST,   "/api/events/**").hasAnyAuthority("MANAGER","ADMIN")
        .requestMatchers(HttpMethod.PUT,    "/api/events/**").hasAnyAuthority("MANAGER","ADMIN")
        .requestMatchers(HttpMethod.DELETE, "/api/events/**").hasAnyAuthority("MANAGER","ADMIN")

        // Orders (other ops require auth)
        .requestMatchers(HttpMethod.GET,    "/api/orders/**").authenticated()
        .requestMatchers(HttpMethod.PUT,    "/api/orders/**").authenticated()
        .requestMatchers(HttpMethod.DELETE, "/api/orders/**").authenticated()

        // Ticket pass endpoints
        .requestMatchers(HttpMethod.GET,  "/api/passes/*").permitAll()        // public QR check
        .requestMatchers(HttpMethod.POST, "/api/passes/*/redeem").hasAnyAuthority("STAFF")

        // Manager scope
        .requestMatchers("/api/manager/**").hasRole("MANAGER")

        // Games & game reviews
        .requestMatchers(HttpMethod.GET,    "/api/games/**").permitAll()
        .requestMatchers(HttpMethod.POST,   "/api/games/**").hasAnyAuthority("MANAGER","ADMIN")
        .requestMatchers(HttpMethod.PUT,    "/api/games/**").hasAnyAuthority("MANAGER","ADMIN")
        .requestMatchers(HttpMethod.DELETE, "/api/games/**").hasAnyAuthority("MANAGER","ADMIN")

        .requestMatchers(HttpMethod.POST, "/api/game-reviews").authenticated()
        .requestMatchers(HttpMethod.GET,  "/api/game-reviews/**").permitAll()

        // Branch Staffs
        .requestMatchers(HttpMethod.GET,    "/api/branch-staff/**").hasAnyAuthority("MANAGER","ADMIN")
        .requestMatchers(HttpMethod.POST,   "/api/branch-staff/**").hasAnyAuthority("MANAGER","ADMIN")
        .requestMatchers(HttpMethod.PUT,    "/api/branch-staff/**").hasAnyAuthority("MANAGER","ADMIN")
        .requestMatchers(HttpMethod.DELETE, "/api/branch-staff/**").hasAnyAuthority("MANAGER","ADMIN")

        // Branch Vouchers
        .requestMatchers(HttpMethod.GET,    "/api/vouchers/**").permitAll()
        .requestMatchers(HttpMethod.POST,   "/api/vouchers/**").hasAnyAuthority("MANAGER","ADMIN")
        .requestMatchers(HttpMethod.PUT,    "/api/vouchers/**").hasAnyAuthority("MANAGER","ADMIN")
        .requestMatchers(HttpMethod.DELETE, "/api/vouchers/**").hasAnyAuthority("MANAGER","ADMIN")

        // Branch Amenities
        .requestMatchers(HttpMethod.GET,    "/api/branch-amenities/**").permitAll()
        .requestMatchers(HttpMethod.POST,   "/api/branch-amenities/**").hasAnyAuthority("MANAGER","ADMIN")
        .requestMatchers(HttpMethod.PUT,    "/api/branch-amenities/**").hasAnyAuthority("MANAGER","ADMIN")
        .requestMatchers(HttpMethod.DELETE, "/api/branch-amenities/**").hasAnyAuthority("MANAGER","ADMIN")

        // Park Branches
        .requestMatchers(HttpMethod.GET,    "/api/park-branch/**").permitAll()
        .requestMatchers(HttpMethod.POST,   "/api/park-branch/**").hasAnyAuthority("MANAGER","ADMIN")
        .requestMatchers(HttpMethod.PUT,    "/api/park-branch/**").hasAnyAuthority("MANAGER","ADMIN")
        .requestMatchers(HttpMethod.DELETE, "/api/park-branch/**").hasAnyAuthority("MANAGER","ADMIN")

        // Notification admin
        .requestMatchers(HttpMethod.POST,   "/api/notifications/**", "/api/notification/**").hasAnyAuthority("ADMIN")
        .requestMatchers(HttpMethod.PUT,    "/api/notifications/**", "/api/notification/**").hasAnyAuthority("ADMIN")
        .requestMatchers(HttpMethod.DELETE, "/api/notifications/**", "/api/notification/**").hasAnyAuthority("ADMIN")
        .requestMatchers(org.springframework.http.HttpMethod.GET,  "/api/ticket-types/**").permitAll()
        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/ticket-types/**").hasAnyAuthority("MANAGER","ADMIN")
        .requestMatchers(org.springframework.http.HttpMethod.PUT,  "/api/ticket-types/**").hasAnyAuthority("MANAGER","ADMIN")
        .requestMatchers(org.springframework.http.HttpMethod.DELETE,"/api/ticket-types/**").hasAnyAuthority("MANAGER","ADMIN")
        .requestMatchers(HttpMethod.GET, "/api/events/**").permitAll()
        .requestMatchers(HttpMethod.POST, "/api/orders").permitAll()
        .requestMatchers("/api/orders/**").authenticated()
        .requestMatchers(HttpMethod.POST, "/api/orders/*/refund").authenticated()
        .requestMatchers(HttpMethod.GET , "/api/orders/*/refund").authenticated()
        // View notifications
        .requestMatchers(HttpMethod.GET, "/api/notifications/**", "/api/notification/**").authenticated()

        // Everything else requires JWT
        .anyRequest().authenticated()
      );

    http.addFilterBefore(authenticationFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }

  @Bean
  public MethodSecurityExpressionHandler createExpressionHandler() {
    DefaultMethodSecurityExpressionHandler expressionHandler = new DefaultMethodSecurityExpressionHandler();
    expressionHandler.setPermissionEvaluator(permissionEvaluator);
    return expressionHandler;
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration cfg = new CorsConfiguration();
    // cfg.setAllowedOriginPatterns(List.of(
    //   "http://localhost:5173",
    //   "http://127.0.0.1:5173"
    // ));
    // Allow all origins
    cfg.setAllowedOrigins(List.of("*"));
    // FIX: removed stray comma after POST
    cfg.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS","HEAD"));
    cfg.setAllowedHeaders(List.of("*"));
    cfg.setExposedHeaders(List.of("Authorization", "Location"));
    // when allow all origin allow credentials must be false
    //cfg.setAllowCredentials(true);
    cfg.setAllowCredentials(false);
    cfg.setMaxAge(3600L);


    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", cfg);
    return source;
  }
}
