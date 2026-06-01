package com.pali.palindromebackend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 17/06/2021
 **/
@AllArgsConstructor
@NoArgsConstructor
@Data
@Embeddable
public class CommunityUserPK implements Serializable {
    @ManyToOne
    @JoinColumn(name = "user_id",referencedColumnName = "id")
    private User userId;
    @ManyToOne
    @JoinColumn(name = "community_id",referencedColumnName = "community_id")
    private Community communityId;
}
