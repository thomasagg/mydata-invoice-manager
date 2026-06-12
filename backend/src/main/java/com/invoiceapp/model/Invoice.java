package com.invoiceapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "invoices")
@Data
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // invoice series like "A" or "B"
    private String series;

    // sequential invoice number
    private String aa;

    private LocalDate issueDate;

    // 1.1 = sales, 2.1 = services
    private String invoiceType = "1.1";

    private String currency = "EUR";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;

    // line items - cascade so they save/delete with the invoice
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL)
    private List<InvoiceLine> lines = new ArrayList<>();

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // calculated totals
    @Column(precision = 10, scale = 2)
    private BigDecimal totalNetValue = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalVatAmount = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalGrossValue = BigDecimal.ZERO;

    // result from AADE after submitting
    @Enumerated(EnumType.STRING)
    private InvoiceStatus mydataStatus = InvoiceStatus.PENDING;

    // MARK number returned by AADE when accepted
    private Long mydataMark;

    // error message if AADE rejected the invoice
    private String mydataError;
}
