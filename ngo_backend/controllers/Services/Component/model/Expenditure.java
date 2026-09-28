

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "expenditure")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Expenditure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long expenditureId;

    @ManyToOne
    @JoinColumn(name = "campaign_id")
    private Campaign campaign;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Double amount;
    private String billUrl;
    private LocalDate spentOn;
    private String verifiedBy;
}
