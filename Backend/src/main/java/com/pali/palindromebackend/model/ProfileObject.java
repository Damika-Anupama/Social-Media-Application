package com.pali.palindromebackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 7/18/2022
 **/
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProfileObject implements Serializable {
    private Date createdDate;
}
