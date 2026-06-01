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
public class ShareDTO implements SuperDTO{
    private int id;
    private Date dateTime;
    private Date lastUpdatedDate;
    private String sharedPlaceId;
    private int user;
    private int launch;
}
