package com.pali.palindromebackend.business.util;

import com.pali.palindromebackend.dto.*;
import com.pali.palindromebackend.entity.*;
import org.mapstruct.Mapper;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 28/04/2021
 **/
@Mapper(componentModel = "spring")
public interface EntityDTOMapper {
    User getUser(UserDTO dto);
    UserDTO getUserDTO(User user);

    Community getCommunity(CommunityDTO dto);
    CommunityDTO getCommunityDTO(Community community);


    Page getPage(PageDTO dto);
    PageDTO getPageDTO(Page page);
}
