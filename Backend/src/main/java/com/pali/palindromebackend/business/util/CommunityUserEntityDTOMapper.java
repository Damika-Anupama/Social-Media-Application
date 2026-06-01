package com.pali.palindromebackend.business.util;

import com.pali.palindromebackend.dao.CommunityDAO;
import com.pali.palindromebackend.dao.UserDAO;
import com.pali.palindromebackend.dto.CommunityUserDTO;
import com.pali.palindromebackend.entity.Community;
import com.pali.palindromebackend.entity.CommunityUser;
import com.pali.palindromebackend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 6/23/2022
 **/
@Mapper(componentModel = "spring", uses = {EntityDTOMapper.class})
public abstract class CommunityUserEntityDTOMapper {
    @Autowired
    private UserDAO userDAO;
    @Autowired
    private CommunityDAO communityDAO;

    public User getUser(CommunityUserDTO dto) {
        return userDAO.getOne(dto.getUserId());
    }
    public Community getCommunity(CommunityUserDTO dto) {
        return communityDAO.getOne(dto.getCommunityId());
    }

    @Mapping(source = "userId", target = "pk.userId.id")
    @Mapping(source = "communityId", target = "pk.communityId.communityId")
    public abstract CommunityUser getCommunityUser(CommunityUserDTO dto);

    @Mapping(source = "pk.userId.id", target = "userId")
    @Mapping(source = "pk.communityId.communityId", target = "communityId")
    public abstract CommunityUserDTO getCommunityUserDTO(CommunityUser communityUser);
}
