package com.pali.palindromebackend.business.util.impl;

import com.pali.palindromebackend.business.util.ReactionEntityDTOMapper;
import com.pali.palindromebackend.dto.ReactionDTO;
import com.pali.palindromebackend.entity.Reaction;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 10/05/2022
 **/
public class ReactionEntityDTOMapperImpl extends ReactionEntityDTOMapper  {
    @Override
    public Reaction getReaction(ReactionDTO dto) {
        if (dto == null) {
            return null;
        }

        Reaction reaction = new Reaction();
        try {
            reaction.setUser(getUser(dto));
            reaction.setLaunch(getLaunch(dto));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        reaction.setId(dto.getId());
        reaction.setType(dto.getType());
        reaction.setReactionTime(dto.getReactionTime());
        reaction.setUpdatedTime(dto.getUpdatedTime());
        System.out.println(reaction);
        return reaction;
    }

    @Override
    public ReactionDTO getReactionDTO(Reaction reaction) {

        if (reaction == null){
            return null;
        }

        ReactionDTO dto = new ReactionDTO();
        dto.setId(reaction.getId());
        dto.setType(reaction.getType());
        dto.setReactionTime(reaction.getReactionTime());
        dto.setUpdatedTime(reaction.getUpdatedTime());
        dto.setUserId(reaction.getUser().getId());
        dto.setLaunchId(reaction.getLaunch().getId());
        return dto;
    }
}
