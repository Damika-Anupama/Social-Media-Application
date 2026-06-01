package com.pali.palindromebackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 5/11/2022
 **/
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "share", uniqueConstraints = @UniqueConstraint(columnNames = {"id"}))
@Data
public class Share implements SuperEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    @Column(name = "date_time")
    private Date dateTime;
    @Column(name = "last_updated_date")
    private Date lastUpdatedDate;
    @Column(name = "shared_place_id")
    private String sharedPlaceId; // may be a profile, group or page

    @JsonIgnoreProperties("launches")
    @ManyToOne(cascade = {CascadeType.ALL})
    @JoinColumn(name = "user_who_shared",referencedColumnName = "id",nullable = false)
    private User user;

    @JsonIgnoreProperties("launches")
    @ManyToOne(cascade = {CascadeType.ALL})
    @JoinColumn(name = "launch_id",referencedColumnName = "id",nullable = false)
    private Launch launch;

}
