package com.pali.palindromebackend.business.custom;

import com.pali.palindromebackend.business.SuperBO;
import com.pali.palindromebackend.dto.CommunityDTO;
import com.pali.palindromebackend.dto.FriendDTO;
import com.pali.palindromebackend.entity.Community;

import java.util.List;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 17/06/2021
 **/

public interface CommunityBO extends SuperBO {
    Community saveCom(CommunityDTO dto);

    void updateCom(CommunityDTO dto);

    void deleteCom(int comId);

    List<CommunityDTO> getAllCommunities();

    CommunityDTO getCom(int ComId);

}
