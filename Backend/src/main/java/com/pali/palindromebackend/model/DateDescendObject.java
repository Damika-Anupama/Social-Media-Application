package com.pali.palindromebackend.model;

import com.pali.palindromebackend.entity.ObjectType;
import com.pali.palindromebackend.entity.OnlineStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 7/17/2022
 **/
@AllArgsConstructor
@NoArgsConstructor
@Data
public class DateDescendObject implements Serializable {
    private Date createdDate;
    private ObjectType type;
    private int id;
    //from community
    private String title;
    private String communityDescription;
    private byte[] groupIcon;
    private byte[] wallpaper;
    //from friend
    private String friendUsername;
    private boolean asked; // whether the friend requested and you accepted or you asked friend accepted
    private byte[] profilePicture;
    //from launch
    private byte[] file;
    private String mediaType;
    private String launchDescription;
    private String feeling;
    private int userId;
    private String userName;
    private String shortDescription;
    private byte[] userprofilePicture;
    private OnlineStatus userOnlineStatus;
    private Date updatedTime;
    private List<LaunchReactionBody> reactions;
    private List<LaunchCommentBody> comments;

    public boolean getAsked() {
        return asked;
    }

    public void setAsked(boolean asked) {
        this.asked = asked;
    }
}
