package com.pali.palindromebackend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.Date;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 7/17/2022
 **/
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "launch_community")
@Entity
public class CommunityLaunch implements Serializable {
    @EmbeddedId
    private CommunityLaunchPK pk;
    @Column(name = "existing_status")
    private ExistingStatus existingStatus;
    @Column(name = "shared_person_id")
    private int sharedPersonId;
    @Column(name = "shared_time")
    private Date sharedTime;
}
