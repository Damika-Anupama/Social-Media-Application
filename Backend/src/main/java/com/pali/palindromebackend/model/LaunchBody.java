package com.pali.palindromebackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 03/06/2021
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LaunchBody implements Serializable {
    private MultipartFile file;
    private String description;
    private String feeling;
    private int user;
}
