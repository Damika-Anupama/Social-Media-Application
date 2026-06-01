package com.pali.palindromebackend.business.util;

import com.pali.palindromebackend.dao.UserDAO;
import com.pali.palindromebackend.dto.SuggestionDTO;
import com.pali.palindromebackend.dto.SuggestionUserDTO;
import com.pali.palindromebackend.entity.Suggestion;
import com.pali.palindromebackend.entity.SuggestionUser;
import com.pali.palindromebackend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 19/06/2021
 **/
@Mapper(componentModel = "spring", uses = {EntityDTOMapper.class})
public abstract class SuggestionEntityDTOMapper {
    @Autowired
    private UserDAO userDAO;

    @Mapping(source = ".", target = "user")
    public abstract Suggestion getSuggestion(SuggestionDTO dto);

    @Mapping(source = "user", target = "user", qualifiedByName = "User")
    public abstract SuggestionDTO getSuggestionDTO(Suggestion suggestion);

    public User getUser(SuggestionDTO dto) {
        return userDAO.getOne(dto.getUser());
    }

    @Named("User")
    public int getUserId(User user) {
        return user.getId();
    }

    public abstract SuggestionUser getSuggestionUser(SuggestionUserDTO dto);

    public abstract SuggestionUserDTO getSuggestionUserDTO(SuggestionUser suggestionUser);
}
