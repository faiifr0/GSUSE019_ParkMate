package park.management.com.vn.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;
import park.management.com.vn.config.model.JWTConfigModel;
import park.management.com.vn.entity.Users;
import park.management.com.vn.security.UserPrincipal;

@Log4j2
@Service
@RequiredArgsConstructor
public class JWTTokenUtils {

    private final JWTConfigModel jwtConfigModel;

    public String generateAccessToken(Users user) {
        Date now = new Date();
        Calendar instance = Calendar.getInstance();
        instance.setTime(now);
        instance.add(Calendar.DATE, jwtConfigModel.getExpireTime());
        Key key = Keys.hmacShaKeyFor(jwtConfigModel.getSecret().getBytes());

        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("userId", user.getId())
                .setIssuedAt(now)
                .setExpiration(instance.getTime())
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();


    }

    public Claims getClaims(String authToken) {
        Key key = Keys.hmacShaKeyFor(jwtConfigModel.getSecret().getBytes());
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(authToken)
                .getBody();
    }

    public boolean validateToken(String authToken) {
        try {
            Key key = Keys.hmacShaKeyFor(jwtConfigModel.getSecret().getBytes());
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(authToken);
            return true;
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token", ex);
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT token", ex);
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token", ex);
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty.", ex);
        }
        return false;
    }

    public Authentication getAuthentication(String authToken) {
        Claims claims = getClaims(authToken);

        String username = claims.getSubject();
        Long userId = claims.get("userId", Long.class);

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();

        Optional.ofNullable(claims.get("roles"))
                .ifPresent(x -> {
                    for (String s : (List<String>) x) {
                        authorities.add(new SimpleGrantedAuthority(s));
                    }
                });

        UserPrincipal principal = new UserPrincipal(userId, username, authorities);

        return new UsernamePasswordAuthenticationToken(principal, authToken, authorities);
    }

}
