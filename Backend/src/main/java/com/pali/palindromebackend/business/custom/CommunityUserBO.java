package com.pali.palindromebackend.business.custom;

import com.pali.palindromebackend.dto.CommunityUserDTO;
import com.pali.palindromebackend.entity.CommunityUserPK;
import com.pali.palindromebackend.model.MiniUserComDTO;

import java.util.List;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 6/22/2022
 **/

public interface CommunityUserBO {
    void saveCommunityUser(CommunityUserDTO dto);

    void updateCommunityUser(CommunityUserDTO dto);

    void deleteCommunityUser(CommunityUserPK pk);

    List<CommunityUserDTO> getAllCommunityUsers();

    CommunityUserDTO getCommunityUser(CommunityUserPK pk);

    List<CommunityUserDTO> getAllCommunitiesByUserId(int userId);

    List<MiniUserComDTO> getCommunityUsers(int comId);
}
