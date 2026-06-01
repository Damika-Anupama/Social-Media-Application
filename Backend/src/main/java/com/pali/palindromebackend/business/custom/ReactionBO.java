package com.pali.palindromebackend.business.custom;

import com.pali.palindromebackend.business.SuperBO;
import com.pali.palindromebackend.dto.ReactionDTO;

import java.util.List;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 28/04/2021
 **/
public interface ReactionBO extends SuperBO {
    void saveReaction(ReactionDTO dto);

    void updateReaction(ReactionDTO dto);

    void deleteReaction(int reactionId);

    List<ReactionDTO> getAllReactions();

    ReactionDTO getReaction(int reactionId);

    boolean checkUniqueness(int userId, int launchId);

    List<ReactionDTO> getLaunchReactions(int launchId);
}
