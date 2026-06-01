package com.pali.palindromebackend.business.util.impl;

import com.pali.palindromebackend.business.util.LaunchEntityDTOMapper;
import com.pali.palindromebackend.dto.CommentDTO;
import com.pali.palindromebackend.dto.LaunchDTO;
import com.pali.palindromebackend.dto.ShareDTO;
import com.pali.palindromebackend.entity.Comment;
import com.pali.palindromebackend.entity.Launch;
import com.pali.palindromebackend.entity.Share;

import javax.annotation.Generated;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 11/06/2021
 **/
@Generated(
        value = "org.mapstruct.ap.MappingProcessor",
        date = "2021-06-06T18:10:44+0530",
        comments = "version: 1.4.2.Final, compiler: javac, environment: Java 1.8.0_261 (Oracle Corporation)"
)
//@Component

public class LaunchEntityDTOMapperImpl extends LaunchEntityDTOMapper {
    @Override
    public Launch getLaunch(LaunchDTO dto) {
        if (dto == null){
            return null;
        }

        Launch launch = new Launch();
        try{
            launch.setUser(getUser(dto));
        }catch (Exception e){
            throw new RuntimeException(e);
        }
        launch.setId(dto.getId());
        launch.setDescription(dto.getDescription());
        launch.setFeeling(dto.getFeeling());
        launch.setMedia(dto.getMedia());
        launch.setMediaType(dto.getMediaType());
        return launch;
    }

    @Override
    public LaunchDTO getLaunchDTO(Launch launch) {
        if(launch == null){
            return null;
        }

        LaunchDTO dto = new LaunchDTO();

        dto.setUser(getUserName(launch.getUser()));
        dto.setId(launch.getId());
        dto.setDescription(launch.getDescription());
        dto.setMedia(launch.getMedia());
        dto.setMediaType(launch.getMediaType());
        dto.setFeeling(launch.getFeeling());
        return dto;
    }

    @Override
    public Comment getComment(CommentDTO dto) {
        if (dto == null){
            return null;
        }

        Comment comment = new Comment();
        try{
            comment.setUser(getUser1(dto));
            comment.setLaunch(getLaunch1(dto));
        }catch (Exception e){
            throw new RuntimeException(e);
        }
        comment.setId(dto.getId());
        comment.setComment(dto.getComment());
        comment.setCommentedDate(dto.getCommentedDate());
        comment.setLastUpdatedDate(dto.getLastUpdatedDate());
        return comment;
    }

    @Override
    public CommentDTO getCommentDTO(Comment comment) {
        if(comment == null){
            return null;
        }

        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setComment(comment.getComment());
        dto.setCommentedDate(comment.getCommentedDate());
        dto.setLastUpdatedDate(comment.getLastUpdatedDate());
        dto.setUser(comment.getUser().getId());
        dto.setLaunch(comment.getLaunch().getId());
        return dto;
    }

    @Override
    public Share getShare(ShareDTO dto) {
        if(dto == null){
            return null;
        }
        Share share = new Share();
        try{
            share.setUser(getUser2(dto));
            share.setLaunch(getLaunch2(dto));
        }catch (Exception e){
            throw new RuntimeException(e);
        }
        share.setId(dto.getId());
        share.setDateTime(dto.getDateTime());
        share.setSharedPlaceId(dto.getSharedPlaceId());
        share.setLastUpdatedDate(dto.getLastUpdatedDate());
        return share;
    }

    @Override
    public ShareDTO getShareDTO(Share share) {
        if(share == null){
            return null;
        }
        ShareDTO shareDTO = new ShareDTO();
        shareDTO.setId(share.getId());
        shareDTO.setLaunch(share.getLaunch().getId());
        shareDTO.setLaunch(share.getLaunch().getId());
        shareDTO.setLastUpdatedDate(share.getLastUpdatedDate());
        shareDTO.setSharedPlaceId(share.getSharedPlaceId());
        return shareDTO;
    }
}
