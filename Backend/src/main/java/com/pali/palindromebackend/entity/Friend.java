package com.pali.palindromebackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 15/06/2021
 **/
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity(name = "friend")
public class Friend implements SuperEntity {
    @Id
    @Column(name = "friendship_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int friendshipId;
    private int friend1;
    @JsonIgnoreProperties("friends")
    @JoinColumn(name = "friend2", referencedColumnName = "id", nullable = false)
    @ManyToOne(cascade = {CascadeType.MERGE})
    private User user;
    @Column(name = "asked_date")
    private Date askedDate;
    @Column(name = "is_confirmed")
    private boolean isConfirmed;
    @Column(name = "friendship_date")
    private Date friendshipDate;
    @Column(name = "is_blocked")
    private boolean isBlocked;
    @Column(name = "blocked_by")
    private String blockedBy;
    @Column(name = "blocked_date")
    private Date blockedDate;

    public boolean getIsBlocked() {
        return isBlocked;
    }

    public void setIsBlocked(boolean blocked) {
        isBlocked = blocked;
    }

    public boolean getIsConfirmed() {
        return isConfirmed;
    }

    public void setIsConfirmed(boolean confirmed) {
        isConfirmed = confirmed;
    }

    public Date getAskedDate() {
        return askedDate;
    }

    public void setAskedDate(Date askedDate) {
        this.askedDate = askedDate;
    }
}
 /*
    Friend Logic

    * friend1 = first user who asked for the friendship
    * friend2 = second user who needs to confirm the friendship
    * askedDate = the date first user asked for the friendship
    * isConfirmed = True after second user accepts the friendship
    * friendshipDate = second user confirmed date
    * isBlocked = whether the friendship has blocked
    * blockedBy = friend1 or friend2 (requested person)
    * blockedDate
    * */