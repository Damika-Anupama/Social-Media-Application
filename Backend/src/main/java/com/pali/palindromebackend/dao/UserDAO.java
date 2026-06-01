package com.pali.palindromebackend.dao;

import com.pali.palindromebackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 28/04/2021
 **/
public interface UserDAO extends JpaRepository<User, Integer> {

    Optional<User> findUserByUsername(String username);

    @Query("select u.profilePicture from User u where u.id like ?1")
    String findUserProfilePicture(int id);

    @Transactional
    @Modifying
    @Query("update User set username = ?2, email = ?3, shortDescription = ?4, profilePicture = ?5, contactNum = ?6 where id = ?1")
    void updateUserNormalDetails(int id, String username, String email, String shortDescription, String profilePicture, String contactNum);

    @Query("select u from User u where u.email like ?1")
    User findUserByEmail(String email);

    @Modifying
    @Query("UPDATE User SET onlineStatus = 1 WHERE id = ?1")
    void setLogOut(int userId);
}
