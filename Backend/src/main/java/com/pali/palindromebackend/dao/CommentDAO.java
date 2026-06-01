package com.pali.palindromebackend.dao;

import com.pali.palindromebackend.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 5/11/2022
 **/
public interface CommentDAO extends JpaRepository<Comment,Integer> {
    @Query("select new com.pali.palindromebackend.entity.Comment(" +
            "c.id," +
            "c.comment," +
            "c.commentedDate," +
            "c.lastUpdatedDate," +
            "c.user," +
            "c.launch" +
            ") from Comment c where c.launch.id like ?1")
    List<Comment> findLaunchComment(int launchId);
}
