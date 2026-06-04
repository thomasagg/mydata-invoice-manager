package com.invoiceapp.repository;

import com.invoiceapp.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    // get all invoices for a user, newest first
    List<Invoice> findByUserIdOrderByIssueDateDesc(Long userId);

    // find an invoice only if it belongs to the given user
    Optional<Invoice> findByIdAndUserId(Long id, Long userId);
}
