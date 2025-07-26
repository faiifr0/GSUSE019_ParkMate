package park.management.com.vn.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import park.management.com.vn.entity.base.BaseEntity;

@Entity
@Table(name = "notification")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Notification extends BaseEntity {

  @ManyToOne
  @JoinColumn(name = "user_id")
  private Users user;

  @Column(name = "message", nullable = false)
  private String message;

  @Column(name = "notification_type")
  private String notificationType; // 'email' or 'app'

  @Column(name = "sent_at")
  private LocalDateTime sentAt;

  @Column(name = "status")
  private String status; // 'sent', 'pending', 'failed'
}