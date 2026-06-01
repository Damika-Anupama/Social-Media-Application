package com.pali.palindromebackend.model;

import com.pali.palindromebackend.entity.ExistingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 7/17/2022
 **/
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CommunityLaunchCreate implements Serializable {
    private LaunchBody launchBody;
    private int communityId;
    private ExistingStatus existingStatus = ExistingStatus.CREATED;
    private int sharedPersonId;
    private Date sharedTime;
}
