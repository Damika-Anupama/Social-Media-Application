package com.pali.palindromebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 5/11/2022
 **/
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CommentDTO implements SuperDTO{
    private int id;
    private String comment;
    private Date commentedDate;
    private Date lastUpdatedDate;
    private int user;
    private int launch;
}
