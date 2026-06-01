package com.pali.palindromebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 20/06/2021
 **/
@AllArgsConstructor
@NoArgsConstructor
@Data
public class SuggestionUserDTO {
    private int id;
    private String message;
    private String priority;
    private String feeling;
    private String username;
    private int userId;
    private String profilePicture;
}
