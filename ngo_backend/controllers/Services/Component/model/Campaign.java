


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "campaign")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long campaignId;

    @ManyToOne
    @JoinColumn(name = "ngo_id")
    private NGO ngo;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Double targetAmount;
    private Double raisedAmount = 0.0;
    private LocalDate startDate;
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

    public enum Status {
        ACTIVE, COMPLETED, CLOSED
    }
}