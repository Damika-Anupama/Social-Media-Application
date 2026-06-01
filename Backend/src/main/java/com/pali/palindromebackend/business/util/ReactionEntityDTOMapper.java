package com.pali.palindromebackend.business.util;

import com.pali.palindromebackend.dao.LaunchDAO;
import com.pali.palindromebackend.dao.UserDAO;
import com.pali.palindromebackend.dto.ReactionDTO;
import com.pali.palindromebackend.entity.Launch;
import com.pali.palindromebackend.entity.Reaction;
import com.pali.palindromebackend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 10/05/2022
 **/
@Mapper(componentModel = "spring", uses = {EntityDTOMapper.class})
public abstract class ReactionEntityDTOMapper {
    @Autowired
    private UserDAO userDAO;

    @Autowired
    private LaunchDAO launchDAO;

    @Mapping(source = ".", target = "user")
    @Mapping(source = ".", target = "launch")
    public abstract Reaction getReaction(ReactionDTO dto);

    @Mapping(source = "user", target = "userId", qualifiedByName = "User")
    @Mapping(source = "launch",target = "launchId", qualifiedByName = "Launch")
    public abstract ReactionDTO getReactionDTO(Reaction reaction);

    @Named("User")
    public int getUserName(User user) {
        return user.getId();
    }

    @Named("Launch")
    public int getLaunchId(Launch launch) {
        return launch.getId();
    }

    public Launch getLaunch(ReactionDTO dto) {return launchDAO.getOne(dto.getLaunchId());}

    public User getUser(ReactionDTO dto) {
        return userDAO.getOne(dto.getUserId());
    }


}
