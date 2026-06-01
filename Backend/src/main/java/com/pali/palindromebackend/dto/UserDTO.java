package com.pali.palindromebackend.dto;

import com.pali.palindromebackend.entity.Gender;
import com.pali.palindromebackend.entity.OnlineStatus;
import com.pali.palindromebackend.entity.Relationship;
import com.pali.palindromebackend.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 28/04/2021
 **/
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDTO implements SuperDTO {
    // implicitly setting data
    private int id;
    private Date createdAt;
    private boolean isActive;
    private Role role;
    private Date updatedAt;
    private Date lastLogin;
    private OnlineStatus onlineStatus;
    //explicitly setting data
    @NotEmpty(message = "username cannot be empty !!")
    private String username;
    @NotNull(message = "password cannot be null !!")
    private String password;
    private String fullName;
    private Gender gender;
    private String email;
    private String shortDescription;
    private String profilePicture;
    private String contactNum;
    private String location;
    private String education;
    private String skills;
    private Date dob;
    private Relationship relationship;

    public boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(boolean isActive) {
        this.isActive = isActive;
    }
}
