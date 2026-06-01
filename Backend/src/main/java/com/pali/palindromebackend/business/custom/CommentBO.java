package com.pali.palindromebackend.business.custom;

import com.pali.palindromebackend.business.SuperBO;
import com.pali.palindromebackend.dto.CommentDTO;

import java.util.List;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 5/11/2022
 **/
public interface CommentBO extends SuperBO {
    void saveComment(CommentDTO dto);

    void updateComment(CommentDTO dto);

    void deleteComment(int commentId);

    List<CommentDTO> getAllComments();

    CommentDTO getComment(int CommentId);

    List<CommentDTO> getLaunchComments(int launchId);
}
