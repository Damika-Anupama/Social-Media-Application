package com.pali.palindromebackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 25/06/2021
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class HomePageLoading implements Serializable {
    private byte[] profilePic;
}
