package com.pali.palindromebackend.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 17/06/2021
 **/
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "user_page")
@Entity
public class UserPageDetail implements SuperEntity{
    @EmbeddedId
    private UserPageDetailPK pk;
    @Column(name = "joined_date")
    private Date joinedDate;
    private Role role;
}
