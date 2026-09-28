import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "ngo")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NGO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ngoId;

    private String name;
    private String registrationNo;
    private String email;
    private String phone;
    private String address;
    private String certificateUrl;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    private LocalDate registeredOn = LocalDate.now();

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User admin;

    public enum Status {
        PENDING, APPROVED, REJECTED
    }
}