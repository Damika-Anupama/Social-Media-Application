package com.pali.palindromebackend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Embeddable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.io.Serializable;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 7/17/2022
 **/
@AllArgsConstructor
@NoArgsConstructor
@Data
@Embeddable
public class CommunityLaunchPK implements Serializable {
    @ManyToOne
    @JoinColumn(name = "launch_id",referencedColumnName = "id")
    private Launch launch;
    @ManyToOne
    @JoinColumn(name = "community_id",referencedColumnName = "community_id")
    private Community community;
}
