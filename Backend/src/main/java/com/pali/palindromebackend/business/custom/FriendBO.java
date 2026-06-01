package com.pali.palindromebackend.business.custom;

import com.pali.palindromebackend.business.SuperBO;
import com.pali.palindromebackend.dto.FriendDTO;

import java.util.List;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 15/06/2021
 **/
public interface FriendBO extends SuperBO {

    void saveFriend(FriendDTO dto);

    void updateFriend(FriendDTO dto);

    void deleteFriend(int friendshipId);

    List<FriendDTO> getAllFriends();

    FriendDTO getFriend(int friendshipId);

    boolean findWhetherFriendshipExist(FriendDTO dto);

    List<FriendDTO> getAllFriendsByUserId(int userId);
}
