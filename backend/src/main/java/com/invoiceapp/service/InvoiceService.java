package com.invoiceapp.service;

import com.invoiceapp.dto.InvoiceRequest;
import com.invoiceapp.model.*;
import com.invoiceapp.repository.ClientRepository;
import com.invoiceapp.repository.InvoiceRepository;
import com.invoiceapp.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

@Service
public class InvoiceService {

    private static final Map<Integer, BigDecimal> VAT_RATES = Map.of(
            1, new BigDecimal("0.24"),
            2, new BigDecimal("0.13"),
            3, new BigDecimal("0.06"),
            7, BigDecimal.ZERO,
            8, BigDecimal.ZERO
    );

    private final InvoiceRepository invoiceRepository;
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;
    private final MyDataService myDataService;

    public InvoiceService(InvoiceRepository invoiceRepository, ClientRepository clientRepository,
                          UserRepository userRepository, MyDataService myDataService) {
        this.invoiceRepository = invoiceRepository;
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
        this.myDataService = myDataService;
    }

    public List<Invoice> getInvoices(String username) {
        User user = getUser(username);
        return invoiceRepository.findByUserIdOrderByIssueDateDesc(user.getId());
    }

    public Invoice getInvoice(Long id, String username) {
        User user = getUser(username);
        return invoiceRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
    }

    @Transactional
    public Invoice createAndSubmit(InvoiceRequest request, String username) {
        User user = getUser(username);
        Client client = clientRepository.findByIdAndUserId(request.getClientId(), user.getId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        Invoice invoice = new Invoice();
        invoice.setSeries(request.getSeries());
        invoice.setAa(request.getAa());
        invoice.setIssueDate(request.getIssueDate());
        invoice.setInvoiceType(request.getInvoiceType());
        invoice.setClient(client);
        invoice.setUser(user);

        BigDecimal totalNet = BigDecimal.ZERO;
        BigDecimal totalVat = BigDecimal.ZERO;
        int lineNum = 1;

        for (InvoiceRequest.LineRequest lr : request.getLines()) {
            InvoiceLine line = new InvoiceLine();
            line.setLineNumber(lineNum++);
            line.setDescription(lr.getDescription());
            line.setQuantity(lr.getQuantity());
            line.setUnitPrice(lr.getUnitPrice());

            BigDecimal net = lr.getQuantity().multiply(lr.getUnitPrice()).setScale(2, RoundingMode.HALF_UP);
            BigDecimal vatRate = VAT_RATES.getOrDefault(lr.getVatCategory(), BigDecimal.ZERO);
            BigDecimal vat = net.multiply(vatRate).setScale(2, RoundingMode.HALF_UP);

            line.setNetValue(net);
            line.setVatCategory(lr.getVatCategory());
            line.setVatAmount(vat);
            line.setInvoice(invoice);

            invoice.getLines().add(line);
            totalNet = totalNet.add(net);
            totalVat = totalVat.add(vat);
        }

        invoice.setTotalNetValue(totalNet);
        invoice.setTotalVatAmount(totalVat);
        invoice.setTotalGrossValue(totalNet.add(totalVat));
        invoice.setMydataStatus(InvoiceStatus.PENDING);

        Invoice saved = invoiceRepository.save(invoice);

        MyDataService.MyDataResult result = myDataService.sendInvoice(saved);
        if (result.success()) {
            saved.setMydataStatus(InvoiceStatus.ACCEPTED);
            saved.setMydataMark(result.mark());
        } else {
            saved.setMydataStatus(InvoiceStatus.REJECTED);
            saved.setMydataError(result.error());
        }

        return invoiceRepository.save(saved);
    }

    @Transactional
    public Invoice cancelInvoice(Long id, String username) {
        User user = getUser(username);
        Invoice invoice = invoiceRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        if (invoice.getMydataMark() == null) {
            throw new RuntimeException("Invoice has no myDATA mark, cannot cancel");
        }

        MyDataService.MyDataResult result = myDataService.cancelInvoice(invoice.getMydataMark());
        if (result.success()) {
            invoice.setMydataStatus(InvoiceStatus.CANCELLED);
        } else {
            throw new RuntimeException("myDATA cancellation failed: " + result.error());
        }

        return invoiceRepository.save(invoice);
    }

    @Transactional
    public Invoice resubmitInvoice(Long id, String username) {
        User user = getUser(username);
        Invoice invoice = invoiceRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        if (invoice.getMydataStatus() != InvoiceStatus.REJECTED) {
            throw new RuntimeException("Only rejected invoices can be resubmitted");
        }

        invoice.setMydataStatus(InvoiceStatus.PENDING);
        invoice.setMydataError(null);
        invoiceRepository.save(invoice);

        MyDataService.MyDataResult result = myDataService.sendInvoice(invoice);
        if (result.success()) {
            invoice.setMydataStatus(InvoiceStatus.ACCEPTED);
            invoice.setMydataMark(result.mark());
        } else {
            invoice.setMydataStatus(InvoiceStatus.REJECTED);
            invoice.setMydataError(result.error());
        }

        return invoiceRepository.save(invoice);
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
