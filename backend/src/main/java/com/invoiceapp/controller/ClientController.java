package com.invoiceapp.controller;

import com.invoiceapp.model.Client;
import com.invoiceapp.service.ClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping
    public ResponseEntity<List<Client>> getClients(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(clientService.getClients(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<Client> createClient(@RequestBody Client client,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(clientService.createClient(client, userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable Long id,
                                               @RequestBody Client client,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(clientService.updateClient(id, client, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id,
                                             @AuthenticationPrincipal UserDetails userDetails) {
        clientService.deleteClient(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
