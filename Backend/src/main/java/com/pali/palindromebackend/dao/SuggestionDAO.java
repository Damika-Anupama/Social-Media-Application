package com.pali.palindromebackend.dao;

import com.pali.palindromebackend.entity.Suggestion;
import com.pali.palindromebackend.entity.SuggestionUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 18/06/2021
 **/
public interface SuggestionDAO extends JpaRepository<Suggestion, Integer> {

    @Query("select new com.pali.palindromebackend.entity.SuggestionUser (s.id,s.message,s.priority,s.feeling,u.id,u.username,u.profilePicture) from Suggestion s join s.user u")
    List<SuggestionUser> findAllWithUsers();
}
