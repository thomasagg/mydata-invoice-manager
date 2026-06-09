package com.invoiceapp.controller;

import com.invoiceapp.dto.InvoiceRequest;
import com.invoiceapp.model.Invoice;
import com.invoiceapp.service.InvoiceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @GetMapping
    public ResponseEntity<List<Invoice>> getInvoices(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(invoiceService.getInvoices(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoice(@PathVariable Long id,
                                              @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(invoiceService.getInvoice(id, userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<Invoice> createInvoice(@Valid @RequestBody InvoiceRequest request,
                                                 @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(invoiceService.createAndSubmit(request, userDetails.getUsername()));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Invoice> cancelInvoice(@PathVariable Long id,
                                                 @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(invoiceService.cancelInvoice(id, userDetails.getUsername()));
    }

    @PostMapping("/{id}/resubmit")
    public ResponseEntity<Invoice> resubmitInvoice(@PathVariable Long id,
                                                   @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(invoiceService.resubmitInvoice(id, userDetails.getUsername()));
    }
}
