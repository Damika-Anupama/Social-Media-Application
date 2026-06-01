package com.pali.palindromebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 17/06/2021
 **/
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CommunityDTO implements SuperDTO {
    private int communityId;
    private String title;
    private String description;
    private Date createdDate;
    private String groupIcon;
    private String wallpaper;
}
