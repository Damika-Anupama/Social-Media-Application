package com.pali.palindromebackend.model;

import com.pali.palindromebackend.entity.ExistingStatus;
import com.pali.palindromebackend.entity.OnlineStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 7/27/2022
 **/
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityLaunchDetail {
    private int id;
    private String media;
    private String mediaType;
    private String description;
    private String feeling;
    private int userId;
    private String userName;
    private String shortDescription;
    private String profilePicture;
    private OnlineStatus userOnlineStatus;
    private Date updatedDate;
    private Date createdDate;
    // data relevant to the community
    private ExistingStatus existingStatus;
    private int sharedPersonId;
    private Date sharedTime;
}
