package park.management.com.vn.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import park.management.com.vn.entity.base.BaseEntity;

@Entity
@Table(name ="ai_chat_log")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AIChatLog extends BaseEntity {

    @Column(name = "content")
    private String content;
    @ManyToOne
    private Users user;
}
