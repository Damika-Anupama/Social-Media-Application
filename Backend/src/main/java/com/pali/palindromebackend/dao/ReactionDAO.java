package com.pali.palindromebackend.dao;

import com.pali.palindromebackend.entity.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.ArrayList;


/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 01/06/2021
 **/

public interface ReactionDAO  extends JpaRepository<Reaction,Integer> {
    @Query("select r from Reaction r where r.user.id like ?1 and r.launch.id like ?2")
    Reaction findReaction(int userId, int launchId);

    @Query("select new com.pali.palindromebackend.entity.Reaction (" +
            "r.id," +
            "r.type," +
            "r.reactionTime," +
            "r.updatedTime," +
            "r.launch," +
            "r.user" +
            ") from Reaction r where r.launch.id like ?1")
    ArrayList<Reaction> findLaunchReactions(int launchId);
}
