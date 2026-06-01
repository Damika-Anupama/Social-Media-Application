package com.pali.palindromebackend.model;

import com.pali.palindromebackend.entity.Gender;
import com.pali.palindromebackend.entity.Relationship;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 18/06/2021
 **/
@AllArgsConstructor@NoArgsConstructor@Data
public class SendingUserBody implements Serializable {
    private byte[] profilePicture;
    private String shortDescription;
    private String username;
    private String email;
    private String contactNum;
    private String password;
    private String fullName;
    private Date dob;
    private String education;
    private String skills;
    private Gender gender;
    private Relationship relationship;
}
