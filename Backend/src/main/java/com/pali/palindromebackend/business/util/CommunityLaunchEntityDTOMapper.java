package com.pali.palindromebackend.business.util;

import com.pali.palindromebackend.dao.CommunityDAO;
import com.pali.palindromebackend.dao.LaunchDAO;
import com.pali.palindromebackend.dto.CommunityLaunchDTO;
import com.pali.palindromebackend.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 7/17/2022
 **/
@Mapper(componentModel = "spring", uses = {EntityDTOMapper.class})
public abstract class CommunityLaunchEntityDTOMapper {
    @Autowired
    private LaunchDAO launchDAO;
    @Autowired
    private CommunityDAO communityDAO;

    public Launch getLaunch(CommunityLaunchDTO dto) {
        return launchDAO.getOne(dto.getLaunchId());
    }
    public Community getCommunity(CommunityLaunchDTO dto) {
        return communityDAO.getOne(dto.getCommunityId());
    }

    @Mapping(source = "launchId", target = "pk.launch.id")
    @Mapping(source = "communityId", target = "pk.community.communityId")
    public abstract CommunityLaunch getCommunityLaunch(CommunityLaunchDTO dto);

    @Mapping(source = "pk.launch.id", target = "launchId")
    @Mapping(source = "pk.community.communityId", target = "communityId")
    public abstract CommunityLaunchDTO getCommunityLaunchDTO(CommunityLaunch communityLaunch);
}
