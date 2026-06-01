package com.pali.palindromebackend.dto;

import com.pali.palindromebackend.entity.ReactionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 01/05/2021
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReactionDTO implements SuperDTO{
    private int id;
    private ReactionType type;
    private Date reactionTime;
    private Date updatedTime;
    private int launchId;
    private int userId;
}
