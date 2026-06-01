package com.pali.palindromebackend.model;

import com.pali.palindromebackend.entity.Gender;
import com.pali.palindromebackend.entity.Relationship;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;
import java.util.Date;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 19/06/2021
 **/
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserBody implements Serializable {
    private int id;
    private String username;
    private String email;
    private String shortDes;
    private MultipartFile profilePic;
    private String phoneNum;
    private Date lastLogin;
    private String fullName;
    private Gender gender;
    private String shortDescription;
    private String profilePicture;
    private String contactNum;
    private String location;
    private String education;
    private String skills;
    private Date dob;
    private Relationship relationship;
}
