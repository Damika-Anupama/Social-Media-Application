package com.pali.palindromebackend.business.custom.impl;

import com.pali.palindromebackend.business.custom.UserBO;
import com.pali.palindromebackend.business.util.EntityDTOMapper;
import com.pali.palindromebackend.dao.UserDAO;
import com.pali.palindromebackend.dto.UserDTO;
import com.pali.palindromebackend.entity.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 28/04/2021
 **/
@Transactional
@Service
public class UserBOImpl implements UserBO {
    private final UserDAO userDAO;

    private final EntityDTOMapper mapper;

    public UserBOImpl(UserDAO userDAO, EntityDTOMapper mapper) {
        this.userDAO = userDAO;
        this.mapper = mapper;
    }

    @Override
    public void saveUser(UserDTO dto) {
        User user = mapper.getUser(dto);
        user.setCreatedAt(new Date(System.currentTimeMillis()));
        user.setIsActive(true);
        user.setUpdatedAt(new Date(System.currentTimeMillis()));
        user.setLastLogin(new Date(System.currentTimeMillis()));
        userDAO.save(user);
    }

    @Override
    public void updateUser(UserDTO dto) {
        User user = mapper.getUser(dto);
        user.setUpdatedAt(new Date(System.currentTimeMillis()));
        userDAO.save(mapper.getUser(dto));
    }

    @Override
    public void deleteUser(int userId) {
        userDAO.deleteById(userId);
    }

    @Transactional(readOnly = true)
    @Override
    public List<UserDTO> getAllUsers() {
        return userDAO.findAll().stream().
                map(mapper::getUserDTO).collect(Collectors.toList());
    }

    @Override
    public UserDTO getUser(int userId) {
        return userDAO.findById(userId).map(mapper::getUserDTO).get();
    }

    @Override
    public UserDTO getUserByName(String userName) {
        return userDAO.findUserByUsername(userName).map(mapper::getUserDTO).get();
    }

    @Override
    public String getUserProfilePicture(int id) {
        return userDAO.findUserProfilePicture(id);
    }

    @Override
    public void updateUserNormalDetails(UserDTO dto) {
        userDAO.updateUserNormalDetails(dto.getId(), dto.getUsername(), dto.getEmail(), dto.getShortDescription(), dto.getProfilePicture(), dto.getContactNum());
    }

    @Override
    public void setLogOut(int userId) {
        userDAO.setLogOut(userId);
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        return mapper.getUserDTO(userDAO.findUserByEmail(email));
    }
}
