package com.ngo.controller;

import com.ngo.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/report")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/generate/{ngoId}")
    public ResponseEntity<byte[]> generate(
            @PathVariable Long ngoId) throws Exception {
        byte[] pdf = reportService.generatePDF(ngoId);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=audit_report.pdf")
            .contentType(MediaType.APPLICATION_PDF)
            .body(pdf);
    }
}