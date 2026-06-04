package com.invoiceapp.model;

import jakarta.persistence.*;
import lombok.Data;

// stores registered business user accounts
@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String email;

    // Greek tax number
    @Column(nullable = false)
    private String afm;

    // optional, not all businesses have a registered name
    private String businessName;
}
