package com.pali.palindromebackend.dto;

import com.pali.palindromebackend.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 6/21/2022
 **/
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CommunityUserDTO implements SuperDTO{
    private int userId;
    private int communityId;
    private Date joinedDate;
    private Date updatedDate;
    private Role role;
}
