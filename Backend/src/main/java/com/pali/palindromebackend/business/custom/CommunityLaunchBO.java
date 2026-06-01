package com.pali.palindromebackend.business.custom;

import com.pali.palindromebackend.business.SuperBO;
import com.pali.palindromebackend.dto.CommunityLaunchDTO;
import com.pali.palindromebackend.entity.CommunityLaunchPK;
import com.pali.palindromebackend.model.CommunityLaunchDetail;

import java.util.List;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 7/17/2022
 **/
public interface CommunityLaunchBO extends SuperBO {
    void save(CommunityLaunchDTO dto);

    void update(CommunityLaunchDTO dto);

    void delete(CommunityLaunchPK pk);

    List<CommunityLaunchDTO> getAll();

    CommunityLaunchDTO get(CommunityLaunchPK pk);

    List<CommunityLaunchDetail> getCommunityLaunches(int comId);
}
