package com.pali.palindromebackend.business.util.impl;

import com.pali.palindromebackend.business.util.CommunityUserEntityDTOMapper;
import com.pali.palindromebackend.dto.CommunityUserDTO;
import com.pali.palindromebackend.entity.CommunityUser;
import com.pali.palindromebackend.entity.CommunityUserPK;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 6/23/2022
 **/
public class CommunityUserEntityDTOMapperImpl extends CommunityUserEntityDTOMapper {
    @Override
    public CommunityUser getCommunityUser(CommunityUserDTO dto) {
        CommunityUser communityUser = new CommunityUser();
        try {
            communityUser.setPk(
                    new CommunityUserPK(
                            getUser(dto),getCommunity(dto)
                    )
            );
        }catch (Exception e){
            throw new RuntimeException(e);
        }
        communityUser.setRole(dto.getRole());
        communityUser.setJoinedDate(dto.getJoinedDate());
        communityUser.setUpdatedDate(dto.getUpdatedDate());
        return communityUser;
    }

    @Override
    public CommunityUserDTO getCommunityUserDTO(CommunityUser communityUser) {
        CommunityUserDTO dto = new CommunityUserDTO();
        dto.setUserId(
                communityUser.getPk().getUserId().getId()
        );
        dto.setCommunityId(
                communityUser.getPk().getCommunityId().getCommunityId()
        );
        dto.setRole(communityUser.getRole());
        dto.setJoinedDate(communityUser.getJoinedDate());
        dto.setUpdatedDate(communityUser.getUpdatedDate());
        return dto;
    }
}
