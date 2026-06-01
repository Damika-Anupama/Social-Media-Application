package com.pali.palindromebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 01/06/2021
 **/
@AllArgsConstructor
@NoArgsConstructor
@Data
public class LaunchDTO implements SuperDTO {
    private int id;
    private String media;
    private String mediaType;
    private String description;
    private String feeling;
    private int user;
    private Date createdDate;
    private Date updatedDate;
}
