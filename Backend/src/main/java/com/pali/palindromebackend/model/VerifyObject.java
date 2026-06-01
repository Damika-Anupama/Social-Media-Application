package com.pali.palindromebackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 7/28/2022
 **/
@NoArgsConstructor
@AllArgsConstructor
@Data
public class VerifyObject {
    private String email;
    private int verificationCode;
}
