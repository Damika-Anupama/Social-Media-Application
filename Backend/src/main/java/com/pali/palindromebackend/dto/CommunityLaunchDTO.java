package com.pali.palindromebackend.dto;

import com.pali.palindromebackend.entity.ExistingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 7/17/2022
 **/
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CommunityLaunchDTO implements SuperDTO{
    private int launchId;
    private int communityId;
    private ExistingStatus existingStatus;
    private int sharedPersonId;
    private Date sharedTime;
}
