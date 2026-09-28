package com.ngo.service;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "donation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long donationId;

    @ManyToOne
    @JoinColumn(name = "donor_id")
    private User donor;

    @ManyToOne
    @JoinColumn(name = "campaign_id")
    private Campaign campaign;

    private Double amount;
    private String transactionId;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    private LocalDateTime donatedOn = LocalDateTime.now();

    public enum PaymentStatus {
        PENDING, SUCCESS, FAILED
    }
}
