package com.pali.palindromebackend.business.util;

import com.pali.palindromebackend.dao.UserDAO;
import com.pali.palindromebackend.dto.FriendDTO;
import com.pali.palindromebackend.entity.Friend;
import com.pali.palindromebackend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 15/06/2021
 **/
@Mapper(componentModel = "spring", uses = {EntityDTOMapper.class})
public abstract class FriendEntityDTOMapper {
    @Autowired
    private UserDAO userDAO;

    @Mapping(source = "friend2", target = "user.id")
    public abstract Friend getFriend(FriendDTO dto);

    @Mapping(
            source = "user",
            target = "friend2",
            qualifiedByName = "User"
    )
    public abstract FriendDTO getFriendDTO(Friend friend);

    public User getUser(FriendDTO dto) {
        return userDAO.getOne(dto.getFriend2());
    }

    @Named("User")
    public int getUserName(User user) {
        return user.getId();
    }
}
