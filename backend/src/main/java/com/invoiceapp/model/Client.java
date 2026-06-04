package com.invoiceapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

// a client/customer that a user can issue invoices to
@Entity
@Table(name = "clients")
@Data
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    // Greek tax number of the client
    @Column(nullable = false)
    private String afm;

    private String address;
    private String city;

    // country code, default Greece
    private String country = "GR";

    // the user who added this client
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
}
