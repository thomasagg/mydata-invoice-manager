package com.invoiceapp.service;

import com.invoiceapp.model.Client;
import com.invoiceapp.model.User;
import com.invoiceapp.repository.ClientRepository;
import com.invoiceapp.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientService {

    private final ClientRepository clientRepository;
    private final UserRepository userRepository;

    public ClientService(ClientRepository clientRepository, UserRepository userRepository) {
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
    }

    public List<Client> getClients(String username) {
        User user = getUser(username);
        return clientRepository.findByUserId(user.getId());
    }

    public Client createClient(Client client, String username) {
        User user = getUser(username);
        client.setUser(user);
        return clientRepository.save(client);
    }

    public Client updateClient(Long id, Client updated, String username) {
        User user = getUser(username);
        Client existing = clientRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        existing.setName(updated.getName());
        existing.setAfm(updated.getAfm());
        existing.setAddress(updated.getAddress());
        existing.setCity(updated.getCity());
        existing.setCountry(updated.getCountry());
        return clientRepository.save(existing);
    }

    public void deleteClient(Long id, String username) {
        User user = getUser(username);
        Client client = clientRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Client not found"));
        clientRepository.delete(client);
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
