package com.invoiceapp.service;

import com.invoiceapp.model.Invoice;
import com.invoiceapp.model.InvoiceLine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.ByteArrayInputStream;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;

@Service
public class MyDataService {

    private static final Logger log = LoggerFactory.getLogger(MyDataService.class);

    private static final String NS_INV  = "http://www.aade.gr/myDATA/invoice/v1.0";
    private static final String NS_ICLS = "https://www.aade.gr/myDATA/incomeClassificaton/v1.0";

    @Value("${mydata.user-id}")
    private String userId;

    @Value("${mydata.subscription-key}")
    private String subscriptionKey;

    @Value("${mydata.base-url}")
    private String baseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public record MyDataResult(boolean success, Long mark, String error) {}

    public MyDataResult sendInvoice(Invoice invoice) {
        try {
            String xml = buildInvoiceXml(invoice);
            String url = baseUrl + "/SendInvoices";

            HttpHeaders headers = new HttpHeaders();
            headers.set("aade-user-id", userId);
            headers.set("ocp-apim-subscription-key", subscriptionKey);
            headers.setContentType(MediaType.APPLICATION_XML);

            HttpEntity<String> entity = new HttpEntity<>(xml, headers);
            log.info("Sending XML to myDATA:\n{}", xml);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            log.info("myDATA response:\n{}", response.getBody());

            return parseResponse(response.getBody());
        } catch (Exception e) {
            return new MyDataResult(false, null, e.getMessage());
        }
    }

    public MyDataResult cancelInvoice(Long mark) {
        try {
            String url = baseUrl + "/CancelInvoice?mark=" + mark;

            HttpHeaders headers = new HttpHeaders();
            headers.set("aade-user-id", userId);
            headers.set("ocp-apim-subscription-key", subscriptionKey);

            HttpEntity<Void> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            return parseResponse(response.getBody());
        } catch (Exception e) {
            return new MyDataResult(false, null, e.getMessage());
        }
    }

    private String buildInvoiceXml(Invoice invoice) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document doc = builder.newDocument();

        String iclsCategory = invoice.getInvoiceType() != null && invoice.getInvoiceType().startsWith("2.")
                ? "category1_3" : "category1_1";

        Element root = doc.createElementNS(NS_INV, "InvoicesDoc");
        root.setAttribute("xmlns", NS_INV);
        doc.appendChild(root);

        Element inv = doc.createElementNS(NS_INV, "invoice");
        root.appendChild(inv);

        Element issuer = doc.createElementNS(NS_INV, "issuer");
        addEl(doc, issuer, "vatNumber", invoice.getUser().getAfm());
        addEl(doc, issuer, "country", "GR");
        addEl(doc, issuer, "branch", "0");
        inv.appendChild(issuer);

        Element counterpart = doc.createElementNS(NS_INV, "counterpart");
        addEl(doc, counterpart, "vatNumber", invoice.getClient().getAfm());
        addEl(doc, counterpart, "country", invoice.getClient().getCountry() != null ? invoice.getClient().getCountry() : "GR");
        addEl(doc, counterpart, "branch", "0");
        inv.appendChild(counterpart);

        Element header = doc.createElementNS(NS_INV, "invoiceHeader");
        addEl(doc, header, "series", invoice.getSeries());
        addEl(doc, header, "aa", invoice.getAa());
        addEl(doc, header, "issueDate", invoice.getIssueDate().toString());
        addEl(doc, header, "invoiceType", invoice.getInvoiceType());
        addEl(doc, header, "currency", invoice.getCurrency());
        inv.appendChild(header);

        Element paymentMethods = doc.createElementNS(NS_INV, "paymentMethods");
        Element paymentMethod = doc.createElementNS(NS_INV, "paymentMethodDetails");
        addEl(doc, paymentMethod, "type", "3");
        addEl(doc, paymentMethod, "amount", invoice.getTotalGrossValue().toPlainString());
        paymentMethods.appendChild(paymentMethod);
        inv.appendChild(paymentMethods);

        for (InvoiceLine line : invoice.getLines()) {
            Element details = doc.createElementNS(NS_INV, "invoiceDetails");
            addEl(doc, details, "lineNumber", String.valueOf(line.getLineNumber()));
            addEl(doc, details, "netValue", line.getNetValue().toPlainString());
            addEl(doc, details, "vatCategory", String.valueOf(line.getVatCategory()));
            addEl(doc, details, "vatAmount", line.getVatAmount().toPlainString());

            Element lineIcls = doc.createElementNS(NS_INV, "incomeClassification");
            addIclsEl(doc, lineIcls, "classificationType", "E3_561_001");
            addIclsEl(doc, lineIcls, "classificationCategory", iclsCategory);
            addIclsEl(doc, lineIcls, "amount", line.getNetValue().toPlainString());
            details.appendChild(lineIcls);

            inv.appendChild(details);
        }

        Element summary = doc.createElementNS(NS_INV, "invoiceSummary");
        addEl(doc, summary, "totalNetValue", invoice.getTotalNetValue().toPlainString());
        addEl(doc, summary, "totalVatAmount", invoice.getTotalVatAmount().toPlainString());
        addEl(doc, summary, "totalWithheldAmount", "0.00");
        addEl(doc, summary, "totalFeesAmount", "0.00");
        addEl(doc, summary, "totalStampDutyAmount", "0.00");
        addEl(doc, summary, "totalOtherTaxesAmount", "0.00");
        addEl(doc, summary, "totalDeductionsAmount", "0.00");
        addEl(doc, summary, "totalGrossValue", invoice.getTotalGrossValue().toPlainString());

        Element icls = doc.createElementNS(NS_INV, "incomeClassification");
        addIclsEl(doc, icls, "classificationType", "E3_561_001");
        addIclsEl(doc, icls, "classificationCategory", iclsCategory);
        addIclsEl(doc, icls, "amount", invoice.getTotalNetValue().toPlainString());
        summary.appendChild(icls);

        inv.appendChild(summary);

        Transformer transformer = TransformerFactory.newInstance().newTransformer();
        StringWriter writer = new StringWriter();
        transformer.transform(new DOMSource(doc), new StreamResult(writer));
        return writer.toString();
    }

    private MyDataResult parseResponse(String responseXml) {
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(new ByteArrayInputStream(responseXml.getBytes(StandardCharsets.UTF_8)));

            NodeList markNodes = doc.getElementsByTagName("invoiceMark");
            if (markNodes.getLength() > 0) {
                long mark = Long.parseLong(markNodes.item(0).getTextContent().trim());
                return new MyDataResult(true, mark, null);
            }

            NodeList errorNodes = doc.getElementsByTagName("message");
            if (errorNodes.getLength() == 0) errorNodes = doc.getElementsByTagName("errors");
            String error = errorNodes.getLength() > 0
                    ? errorNodes.item(0).getTextContent().trim()
                    : "Unknown error from myDATA";
            return new MyDataResult(false, null, error);
        } catch (Exception e) {
            return new MyDataResult(false, null, "Failed to parse myDATA response: " + e.getMessage());
        }
    }

    private void addEl(Document doc, Element parent, String tag, String value) {
        Element el = doc.createElementNS(NS_INV, tag);
        el.setTextContent(value);
        parent.appendChild(el);
    }

    private void addIclsEl(Document doc, Element parent, String tag, String value) {
        Element el = doc.createElementNS(NS_ICLS, tag);
        el.setTextContent(value);
        parent.appendChild(el);
    }
}
