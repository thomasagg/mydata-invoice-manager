package com.invoiceapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class InvoiceRequest {

    @NotBlank
    private String series;

    @NotBlank
    private String aa;

    @NotNull
    private LocalDate issueDate;

    private String invoiceType = "1.1";

    @NotNull
    private Long clientId;

    @NotEmpty
    private List<LineRequest> lines;

    @Data
    public static class LineRequest {
        @NotBlank
        private String description;
        @NotNull
        private BigDecimal quantity;
        @NotNull
        private BigDecimal unitPrice;
        @NotNull
        private Integer vatCategory;
    }
}
