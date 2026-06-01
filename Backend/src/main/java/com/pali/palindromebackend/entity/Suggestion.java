package com.pali.palindromebackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 18/06/2021
 **/
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "suggestion")
public class Suggestion implements SuperEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    private String message;
    private String priority;
    private String feeling;
    @JsonIgnoreProperties("suggestions")
    @JoinColumn(name = "user", referencedColumnName = "id", nullable = false)
    @ManyToOne(cascade = {CascadeType.ALL})
    private User user;
}
