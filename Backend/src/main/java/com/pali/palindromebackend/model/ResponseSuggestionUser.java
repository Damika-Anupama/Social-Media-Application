package com.pali.palindromebackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 20/06/2021
 **/
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ResponseSuggestionUser implements Serializable {
    private int id;
    private String message;
    private String priority;
    private String feeling;
    private int userId;
    private String username;
    private byte[] profilePicture;
}
