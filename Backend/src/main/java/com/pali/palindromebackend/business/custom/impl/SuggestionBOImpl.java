package com.pali.palindromebackend.business.custom.impl;

import com.pali.palindromebackend.business.custom.SuggestionBO;
import com.pali.palindromebackend.business.util.SuggestionEntityDTOMapper;
import com.pali.palindromebackend.dao.SuggestionDAO;
import com.pali.palindromebackend.dto.SuggestionDTO;
import com.pali.palindromebackend.dto.SuggestionUserDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 19/06/2021
 **/
@Transactional
@Service
public class SuggestionBOImpl implements SuggestionBO {
    private final SuggestionDAO dao;

    private final SuggestionEntityDTOMapper mapper;

    public SuggestionBOImpl(SuggestionDAO dao, SuggestionEntityDTOMapper mapper) {
        this.dao = dao;
        this.mapper = mapper;
    }

    @Override
    public void saveSuggestion(SuggestionDTO dto) {
        dao.save(mapper.getSuggestion(dto));
    }

    @Override
    public void updateSuggestion(SuggestionDTO dto) {
        dao.save(mapper.getSuggestion(dto));
    }

    @Override
    public void deleteSuggestion(int suggestionId) {
        dao.deleteById(suggestionId);
    }

    @Override
    public List<SuggestionDTO> getAllSuggestions() {
        return dao.findAll().stream().
                map(mapper::getSuggestionDTO).collect(Collectors.toList());
    }

    @Override
    public List<SuggestionUserDTO> getAllSuggestionsWithUsers() {
        return dao.findAllWithUsers().stream().
                map(mapper::getSuggestionUserDTO).collect(Collectors.toList());
    }

    @Override
    public SuggestionDTO getSuggestion(int suggestionId) {
        return dao.findById(suggestionId).map(mapper::getSuggestionDTO).get();
    }
}
