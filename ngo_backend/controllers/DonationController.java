package com.ngo.controller;

import com.ngo.service.DonationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/donate")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class DonationController {

    private final DonationService donationService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(
            @RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(
            donationService.createRazorpayOrder(request)
        );
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            @RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(
            donationService.verifyAndSave(request)
        );
    }
}
