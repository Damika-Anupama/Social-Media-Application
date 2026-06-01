package com.pali.palindromebackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;
import java.util.Date;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 7/17/2022
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReceivingStatusBody implements Serializable {
    private int id;
    private String details;
    private MultipartFile media;
    private String mediaType;
    private Date createdTime;
    private Date expiringTime;
    private boolean isExpired;
    private boolean isSponsored;
    private int viewedNumber;
    private int user;
}
