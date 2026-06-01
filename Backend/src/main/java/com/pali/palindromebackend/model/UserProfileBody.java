package com.pali.palindromebackend.model;

import com.pali.palindromebackend.entity.Gender;
import com.pali.palindromebackend.entity.OnlineStatus;
import com.pali.palindromebackend.entity.Relationship;
import com.pali.palindromebackend.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotEmpty;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 7/15/2022
 **/
@AllArgsConstructor
@NoArgsConstructor@Data
// This is the model class that required for the profile page for each user
public class UserProfileBody implements Serializable {
    // implicitly setting data
    private int id;
    private Date createdDate;
    private boolean isActive;
    private Role role;
    private Date updatedDate;
    private Date lastLogin;
    private OnlineStatus onlineStatus;
    //explicitly setting data
    @NotEmpty(message = "username cannot be empty !!")
    private String username;
    private String fullName;
    private Gender gender;
    private String email;
    private String shortDescription;
    private byte[] profilePicture;
    private String contactNum;
    private String location;
    private String education;
    private String skills;
    private Date dob;
    private Relationship relationship;

    //other details of the user
    private int noOfCommunities;
    private int noOfFriends;
    private int noOfLaunches;

    // full details about the other objects according to their created date
    private List<DateDescendObject> dateDescendObjects;

    public boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(boolean isActive) {
        this.isActive = isActive;
    }
}
