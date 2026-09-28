package com.ngo.controller;

import com.ngo.service.AuditService;
import com.ngo.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuditController {

    private final AuditService auditService;
    private final ReportService reportService;

    @GetMapping("/expenditures")
    public ResponseEntity<?> getExpenditures() {
        return ResponseEntity.ok(
            auditService.getAllExpenditures()
        );
    }

    @GetMapping("/donations")
    public ResponseEntity<?> getDonations() {
        return ResponseEntity.ok(
            auditService.getAllDonations()
        );
    }

    @GetMapping("/flags")
    public ResponseEntity<?> getFlags() {
        return ResponseEntity.ok(auditService.getFlags());
    }

    @PutMapping("/verify/{id}")
    public ResponseEntity<?> verify(@PathVariable Long id) {
        return ResponseEntity.ok(auditService.verify(id));
    }

    @PostMapping("/flag")
    public ResponseEntity<?> flag(
            @RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(auditService.raiseFlag(request));
    }
}
