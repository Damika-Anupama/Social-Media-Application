package com.pali.palindromebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 01/05/2021
 **/
@Data@AllArgsConstructor@NoArgsConstructor
public class LoginDTO implements SuperDTO {
    private String username;
    private String password;
}
