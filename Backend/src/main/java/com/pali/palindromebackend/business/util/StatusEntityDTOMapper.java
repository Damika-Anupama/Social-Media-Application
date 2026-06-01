package com.pali.palindromebackend.business.util;


import com.pali.palindromebackend.dao.UserDAO;
import com.pali.palindromebackend.dto.StatusDTO;
import com.pali.palindromebackend.entity.Status;
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
public abstract class StatusEntityDTOMapper {
    @Autowired
    private UserDAO userDAO;

    @Mapping(source = ".", target = "user")
    public abstract Status getStatus(StatusDTO dto);

    @Mapping(source = "user", target = "user", qualifiedByName = "User")
    public abstract StatusDTO getStatusDTO(Status status);

    public User getUser(StatusDTO dto) {
        return userDAO.getOne(dto.getUser());
    }

    @Named("User")
    public int getUserName(User user) {
        return user.getId();
    }
}
