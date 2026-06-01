package com.pali.palindromebackend.model;

import com.pali.palindromebackend.entity.OnlineStatus;
import com.pali.palindromebackend.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 7/27/2022
 **/
@AllArgsConstructor
@NoArgsConstructor
@Data
public class MiniUserComDTO {
    private int userId;
    private String username;
    private String shortDescription;
    private String profilePicture;
    private OnlineStatus onlineStatus;
    private Date joinedDate;
    private Date updatedDate;
    private Role role;
}
