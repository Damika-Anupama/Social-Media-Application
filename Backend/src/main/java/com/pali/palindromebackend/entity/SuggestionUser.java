package com.pali.palindromebackend.entity;

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
public class SuggestionUser implements SuperEntity {
    private int id;
    private String message;
    private String priority;
    private String feeling;
    private int userId;
    private String username;
    private String profilePicture;
}
