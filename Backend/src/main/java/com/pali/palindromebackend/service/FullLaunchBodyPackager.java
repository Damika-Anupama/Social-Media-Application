package com.pali.palindromebackend.service;

import com.pali.palindromebackend.business.custom.CommentBO;
import com.pali.palindromebackend.business.custom.ReactionBO;
import com.pali.palindromebackend.business.custom.UserBO;
import com.pali.palindromebackend.dto.CommentDTO;
import com.pali.palindromebackend.dto.ReactionDTO;
import com.pali.palindromebackend.dto.UserDTO;
import com.pali.palindromebackend.entity.ReactionType;
import com.pali.palindromebackend.entity.custom.LaunchUserDetails;
import com.pali.palindromebackend.model.DashboardLaunchDetail;
import com.pali.palindromebackend.model.LaunchCommentBody;
import com.pali.palindromebackend.model.LaunchReactionBody;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 7/17/2022
 **/
@Service
public class FullLaunchBodyPackager {
    private final ReactionBO bo1;
    private final CommentBO bo2;
    private final UserBO bo3;

    private final FileService fileService;

    public FullLaunchBodyPackager(ReactionBO bo1, CommentBO bo2, UserBO bo3, FileService fileService) {
        this.bo1 = bo1;
        this.bo2 = bo2;
        this.bo3 = bo3;
        this.fileService = fileService;
    }


    public DashboardLaunchDetail getLaunch(LaunchUserDetails detail){
        final ReactionType[] userReactionType = new ReactionType[1];
        ArrayList<LaunchReactionBody> lr = new ArrayList<>();
        ArrayList<LaunchCommentBody> lc = new ArrayList<>();
        byte[] launchMedia = fileService.getMedia(detail.getMedia());
        byte[] userMedia = fileService.getMedia(detail.getProfilePicture());

        List<ReactionDTO> reactions = bo1.getLaunchReactions(detail.getId());
        List<CommentDTO> comments = bo2.getLaunchComments(detail.getId());

        reactions.forEach(reaction -> {
            UserDTO user = null;
            LaunchReactionBody body;
            byte[] picture = new byte[0];
            // set whether the user has reacted to this launch
            // then what is the type of the reaction
            if(reaction.getUserId() == detail.getUserId()){
                userReactionType[0] = reaction.getType();
            }
            try {
                user = bo3.getUser(reaction.getUserId());
                picture = fileService.getMedia(user.getProfilePicture());
            } catch (Exception e) {
                e.printStackTrace();
            }
//                    assert user != null;
            body = new LaunchReactionBody(
                    reaction.getId(),
                    reaction.getType(),
                    reaction.getReactionTime(),
                    reaction.getUpdatedTime(),
                    user.getId(),
                    user.getUsername(),
                    picture,
                    user.getIsActive()
            );
            lr.add(body);
        });

        comments.forEach(comment -> {
            UserDTO user = null;
            LaunchCommentBody body;
            byte[] picture = new byte[0];

            try {
                user = bo3.getUser(comment.getUser());
                picture = fileService.getMedia(user.getProfilePicture());
            } catch (Exception e) {
                e.printStackTrace();
            }
//                    assert user != null;
            body = new LaunchCommentBody(
                    comment.getId(),
                    comment.getComment(),
                    comment.getCommentedDate(),
                    comment.getLastUpdatedDate(),
                    user.getId(),
                    user.getUsername(),
                    picture,
                    user.getIsActive()
            );
            lc.add(body);
        });

        return new DashboardLaunchDetail(
                detail.getId(),
                launchMedia,
                detail.getMediaType(),
                detail.getDescription(),
                detail.getFeeling(),
                detail.getUserId(),
                detail.getUserName(),
                detail.getShortDescription(),
                userMedia,
                detail.getUserOnlineStatus(),
                detail.getUpdatedDate(),
                detail.getCreatedDate(),
                userReactionType[0],
                lr,
                lc
        );
    }
}
