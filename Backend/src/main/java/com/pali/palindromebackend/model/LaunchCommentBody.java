package com.pali.palindromebackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 7/12/2022
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LaunchCommentBody implements Serializable {
    private int id;
    private String comment;
    private Date commentedDate;
    private Date lastUpdatedDate;
    private int userId;
    private String userName;
    private byte[] userImage;
    private boolean userOnlineStatus;
}
