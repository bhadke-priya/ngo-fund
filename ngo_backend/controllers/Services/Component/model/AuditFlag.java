

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "audit_flag")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditFlag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long flagId;

    private Long campaignId;

    @ManyToOne
    @JoinColumn(name = "auditor_id")
    private User auditor;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    private boolean resolved = false;
    private LocalDate flaggedOn = LocalDate.now();
}
