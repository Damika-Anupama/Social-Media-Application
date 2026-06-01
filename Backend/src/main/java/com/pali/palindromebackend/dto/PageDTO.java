package com.pali.palindromebackend.dto;

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
public class PageDTO implements SuperDTO {
    private int pageId;
    private String name;
    private String description;
    private Date createdDate;
    private Date lastUpdate;
    private int user;
}
