package com.invoiceapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

// a single line item inside an invoice
@Entity
@Table(name = "invoice_lines")
@Data
public class InvoiceLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int lineNumber;
    private String description;

    @Column(precision = 10, scale = 2)
    private BigDecimal quantity;

    @Column(precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(precision = 10, scale = 2)
    private BigDecimal netValue;

    // VAT category codes: 1=24%, 2=13%, 3=6%, 7=0%, 8=exempt (no VAT)
    private int vatCategory;

    @Column(precision = 10, scale = 2)
    private BigDecimal vatAmount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id")
    @JsonIgnore
    private Invoice invoice;
}
