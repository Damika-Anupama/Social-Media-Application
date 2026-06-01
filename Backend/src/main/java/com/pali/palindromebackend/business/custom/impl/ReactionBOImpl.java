package com.pali.palindromebackend.business.custom.impl;

import com.pali.palindromebackend.business.custom.ReactionBO;
import com.pali.palindromebackend.business.util.ReactionEntityDTOMapper;
import com.pali.palindromebackend.dao.ReactionDAO;
import com.pali.palindromebackend.dto.ReactionDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 10/05/2022
 **/
@Transactional
@Service
public class ReactionBOImpl implements ReactionBO {

    private final ReactionDAO dao;

    private final ReactionEntityDTOMapper mapper;

    public ReactionBOImpl(ReactionDAO dao, ReactionEntityDTOMapper mapper) {
        this.dao = dao;
        this.mapper = mapper;
    }

    @Override
    public void saveReaction(ReactionDTO dto) {
        dao.save(mapper.getReaction(dto));
    }

    @Override
    public void updateReaction(ReactionDTO dto) {
        dao.save(mapper.getReaction(dto));
    }

    @Override
    public void deleteReaction(int reactionId) {
        dao.deleteById(reactionId);
    }

    @Override
    public List<ReactionDTO> getAllReactions() {
        return dao.findAll().stream().
                map(mapper::getReactionDTO).collect(Collectors.toList());
    }

    @Override
    public ReactionDTO getReaction(int reactionId) {
        return dao.findById(reactionId).map(mapper::getReactionDTO).get();
    }

    @Override
    public boolean checkUniqueness(int userId, int launchId) {
        return dao.findReaction(userId, launchId) != null;
    }

    @Override
    public List<ReactionDTO> getLaunchReactions(int launchId) {
        return dao.findLaunchReactions(launchId).stream().map(
                mapper::getReactionDTO).collect(Collectors.toList()
        );
    }
}
