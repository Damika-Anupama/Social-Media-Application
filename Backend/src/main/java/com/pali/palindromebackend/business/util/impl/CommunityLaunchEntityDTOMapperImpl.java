package com.pali.palindromebackend.business.util.impl;

import com.pali.palindromebackend.business.util.CommunityLaunchEntityDTOMapper;
import com.pali.palindromebackend.dto.CommunityLaunchDTO;
import com.pali.palindromebackend.entity.CommunityLaunch;
import com.pali.palindromebackend.entity.CommunityLaunchPK;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 7/17/2022
 **/
public class CommunityLaunchEntityDTOMapperImpl extends CommunityLaunchEntityDTOMapper {
    @Override
    public CommunityLaunch getCommunityLaunch(CommunityLaunchDTO dto) {

        return new CommunityLaunch(
                new CommunityLaunchPK(getLaunch(dto),getCommunity(dto)),
                dto.getExistingStatus(),
                dto.getSharedPersonId(),
                dto.getSharedTime()
        );
    }

    @Override
    public CommunityLaunchDTO getCommunityLaunchDTO(CommunityLaunch communityLaunch) {
        return new CommunityLaunchDTO(
                communityLaunch.getPk().getLaunch().getId(),
                communityLaunch.getPk().getCommunity().getCommunityId(),
                communityLaunch.getExistingStatus(),
                communityLaunch.getSharedPersonId(),
                communityLaunch.getSharedTime()
        );
    }
}
