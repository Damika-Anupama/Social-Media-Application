package com.pali.palindromebackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 10/06/2022
 **/

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "reaction", uniqueConstraints = @UniqueConstraint(columnNames = {"id"}))
@Data
public class Reaction implements SuperEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;
    @Column(name = "type")
    private ReactionType type;
    @Column(name = "reaction_time")
    private Date reactionTime;
    @Column(name = "updated_time")
    private Date updatedTime;

    @ManyToOne(cascade = {CascadeType.ALL})
    @JoinColumn(name = "launch_id",referencedColumnName = "id",nullable = false)
    private Launch launch;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
