package com.ngo.controller;

import com.ngo.service.ExpenditureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/expenditure")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ExpenditureController {

    private final ExpenditureService expenditureService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllExpenditures() {
        return ResponseEntity.ok(
            expenditureService.getAllByNGO()
        );
    }

    @PostMapping("/add")
    public ResponseEntity<?> addExpenditure(
            @RequestParam Long campaignId,
            @RequestParam String description,
            @RequestParam Double amount,
            @RequestParam String spentOn,
            @RequestParam MultipartFile bill) {
        return ResponseEntity.ok(
            expenditureService.save(
                campaignId, description, amount, spentOn, bill
            )
        );
    }
}