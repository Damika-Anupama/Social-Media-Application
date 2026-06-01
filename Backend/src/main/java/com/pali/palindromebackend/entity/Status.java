package com.pali.palindromebackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "status")
public class Status {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    private String details;
    private String media;
    @Column(name = "media_type")
    private String mediaType;
    @Column(name = "created_time")
    private Date createdTime;
    @Column(name = "expiring_time")
    private Date expiringTime;
    @Column(name = "is_expired")
    private boolean isExpired;
    @Column(name = "is_sponsored")
    private boolean isSponsored;
    @Column(name = "viewed_number")
    private int viewedNumber;

    @JsonIgnoreProperties("status")
    @JoinColumn(name = "user", referencedColumnName = "id", nullable = false)
    @ManyToOne(cascade = {CascadeType.ALL})
    private User user;
}
