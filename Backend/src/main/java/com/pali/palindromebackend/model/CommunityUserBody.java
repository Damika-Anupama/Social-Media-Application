package com.pali.palindromebackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 6/21/2022
 **/
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CommunityUserBody {
    private int communityId;
    private String title;
    private String description;
    private Date createdDate;
    private MultipartFile groupIcon;
    private MultipartFile wallpaper;
    private int userId;
    private String userRole;
}
