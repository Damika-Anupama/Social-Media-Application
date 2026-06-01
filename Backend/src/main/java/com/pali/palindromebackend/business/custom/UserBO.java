package com.pali.palindromebackend.business.custom;

import com.pali.palindromebackend.business.SuperBO;
import com.pali.palindromebackend.dto.UserDTO;

import java.util.List;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 28/04/2021
 **/
public interface UserBO extends SuperBO {
    void saveUser(UserDTO dto);

    void updateUser(UserDTO dto);

    void deleteUser(int userId);

    List<UserDTO> getAllUsers();

    UserDTO getUser(int userId);

    UserDTO getUserByName(String userName);

    UserDTO getUserByEmail(String email);

    String getUserProfilePicture(int id);

    void updateUserNormalDetails(UserDTO dto);

    void setLogOut(int userId);
}
