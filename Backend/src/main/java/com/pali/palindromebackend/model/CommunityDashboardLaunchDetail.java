package com.pali.palindromebackend.model;

import com.pali.palindromebackend.entity.ExistingStatus;
import com.pali.palindromebackend.entity.OnlineStatus;
import com.pali.palindromebackend.entity.ReactionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 7/27/2022
 **/
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CommunityDashboardLaunchDetail {
    private int launchId;
    private byte[] file;
    private String mediaType;
    private String description;
    private String feeling;
    private int userId;
    private String userName;
    private String shortDescription;
    private byte[] profilePicture;
    private OnlineStatus userOnlineStatus;
    private Date updatedTime;
    private Date createdDate;
    private ReactionType reactType;
    private List<LaunchReactionBody> reactions;
    private List<LaunchCommentBody> comments;
    // details relevant to the community
    private ExistingStatus existingStatus;
    private int sharedPersonId;
    private Date sharedTime;
}
