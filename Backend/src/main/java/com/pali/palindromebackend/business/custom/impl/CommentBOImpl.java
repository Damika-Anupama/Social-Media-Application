package com.pali.palindromebackend.business.custom.impl;

import com.pali.palindromebackend.business.custom.CommentBO;
import com.pali.palindromebackend.business.util.LaunchEntityDTOMapper;
import com.pali.palindromebackend.dao.CommentDAO;
import com.pali.palindromebackend.dto.CommentDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 5/11/2022
 **/
@Transactional
@Service
public class CommentBOImpl implements CommentBO {

    private final CommentDAO dao;
    private final LaunchEntityDTOMapper mapper;

    public CommentBOImpl(CommentDAO dao, LaunchEntityDTOMapper mapper) {
        this.dao = dao;
        this.mapper = mapper;
    }

    @Override
    public void saveComment(CommentDTO dto){
        dao.save(mapper.getComment(dto));
    }

    @Override
    public void updateComment(CommentDTO dto){
        dao.save(mapper.getComment(dto));
    }

    @Override
    public void deleteComment(int commentId){
        dao.deleteById(commentId);
    }

    @Override
    public List<CommentDTO> getAllComments(){
        return dao.findAll().stream().
                map(mapper::getCommentDTO).collect(Collectors.toList());
    }

    @Override
    public CommentDTO getComment(int commentId){
        return dao.findById(commentId).map(mapper::getCommentDTO).get();
    }

    @Override
    public List<CommentDTO> getLaunchComments(int launchId) {
        return dao.findLaunchComment(launchId).stream().map(mapper::getCommentDTO).collect(Collectors.toList()
        );
    }
}
