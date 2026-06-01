package com.pali.palindromebackend.business.util;

import com.pali.palindromebackend.dao.LaunchDAO;
import com.pali.palindromebackend.dao.UserDAO;
import com.pali.palindromebackend.dto.CommentDTO;
import com.pali.palindromebackend.dto.LaunchDTO;
import com.pali.palindromebackend.dto.ShareDTO;
import com.pali.palindromebackend.entity.Comment;
import com.pali.palindromebackend.entity.Launch;
import com.pali.palindromebackend.entity.Share;
import com.pali.palindromebackend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 10/06/2021
 **/
@Mapper(componentModel = "spring",uses = {EntityDTOMapper.class})
public abstract class LaunchEntityDTOMapper {

    @Autowired
    private UserDAO userDAO;
    @Autowired
    private LaunchDAO launchDAO;

    @Mapping(source = ".",target = "user")
    public abstract Launch getLaunch(LaunchDTO dto);
    @Mapping(source = "user",target = "user",qualifiedByName = "User")
    public abstract LaunchDTO getLaunchDTO(Launch launch);

    public User getUser(LaunchDTO dto) {
        return userDAO.getOne(dto.getUser());
    }


    @Named("User")
    public int getUserName(User user){return user.getId();}
    @Named("Launch")
    public int getLaunchId(Launch launch){return launch.getId();}

    /*For Reactions*/

    /*For comments*/
    @Mapping(source = ".",target = "user")
    @Mapping(source = ".",target = "launch")
    public abstract Comment getComment(CommentDTO dto);
    @Mapping(source = "user",target = "user",qualifiedByName = "User")
    @Mapping(source = "launch",target = "launch", qualifiedByName = "Launch")
    public abstract CommentDTO getCommentDTO(Comment comment);
    public User getUser1(CommentDTO dto) {
        return userDAO.getOne(dto.getUser());
    }
    public Launch getLaunch1(CommentDTO dto) {
        return launchDAO.getOne(dto.getLaunch());
    }

    /*For shares*/
    @Mapping(source = ".",target = "user")
    @Mapping(source = ".",target = "launch")
    public abstract Share getShare(ShareDTO dto);
    @Mapping(source = "user",target = "user",qualifiedByName = "User")
    @Mapping(source = "launch",target = "launch",qualifiedByName = "Launch")
    public abstract ShareDTO getShareDTO(Share share);
    public User getUser2(ShareDTO dto) {
        return userDAO.getOne(dto.getUser());
    }
    public Launch getLaunch2(ShareDTO dto) {
        return launchDAO.getOne(dto.getLaunch());
    }
}
