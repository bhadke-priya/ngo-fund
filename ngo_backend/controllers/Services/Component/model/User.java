

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String name;

    @Column(unique = true)
    private String email;

    private String phone;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private boolean active = true;
    private LocalDate joinedOn = LocalDate.now();

    public enum Role {
        DONOR, NGO_ADMIN, AUDITOR, SUPER_ADMIN
    }
}