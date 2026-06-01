package com.pali.palindromebackend.model;

import com.pali.palindromebackend.entity.OnlineStatus;
import com.pali.palindromebackend.entity.Reaction;
import com.pali.palindromebackend.entity.ReactionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 25/06/2021
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardLaunchDetail implements Serializable {
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

}
