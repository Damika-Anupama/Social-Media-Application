package com.pali.palindromebackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 13/06/2021
 **/
@NoArgsConstructor
@AllArgsConstructor
@Data
public class AuthenticateBody implements Serializable {
    private String jwt;
    private int userId;
    private byte[] profilePicture;
    private String userName;
}
