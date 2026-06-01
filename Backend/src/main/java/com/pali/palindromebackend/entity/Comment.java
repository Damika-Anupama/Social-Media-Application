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
@Table(name = "comment",
        uniqueConstraints = @UniqueConstraint(columnNames = {"id"})
)
@Data
public class Comment implements SuperEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    @Column(name = "comment")
    private String comment;
    @Column(name = "commented_date")
    private Date commentedDate;
    @Column(name = "last_updated_date")
    private Date lastUpdatedDate;

    @JsonIgnoreProperties("comments")
    @ManyToOne(cascade = {CascadeType.ALL})
    @JoinColumn(
            name = "user_who_commented",
            referencedColumnName = "id",
            nullable = false
    )
    private User user;

    @JsonIgnoreProperties("comments")
    @ManyToOne(cascade = {CascadeType.ALL})
    @JoinColumn(
            name = "launch_id",
            referencedColumnName = "id",
            nullable = false
    )
    private Launch launch;

}
