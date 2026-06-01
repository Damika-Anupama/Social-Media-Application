package com.pali.palindromebackend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 17/06/2021
 **/
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "user_community")
@Entity
public class CommunityUser implements Serializable {
    @EmbeddedId
    private CommunityUserPK pk;
    @Column(name = "joined_date")
    private Date joinedDate;
    @Column(name = "updated_date")
    private Date updatedDate;
    private Role role;
}
