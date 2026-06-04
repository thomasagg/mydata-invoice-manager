package com.invoiceapp.repository;

import com.invoiceapp.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {

    // get all clients that belong to a specific user
    List<Client> findByUserId(Long userId);

    // find a client only if it belongs to the given user
    Optional<Client> findByIdAndUserId(Long id, Long userId);
}
