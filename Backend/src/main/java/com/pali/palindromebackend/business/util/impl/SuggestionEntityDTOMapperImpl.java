package com.pali.palindromebackend.business.util.impl;

import com.pali.palindromebackend.business.util.SuggestionEntityDTOMapper;
import com.pali.palindromebackend.dto.SuggestionDTO;
import com.pali.palindromebackend.dto.SuggestionUserDTO;
import com.pali.palindromebackend.entity.Suggestion;
import com.pali.palindromebackend.entity.SuggestionUser;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 19/06/2021
 **/
public class SuggestionEntityDTOMapperImpl extends SuggestionEntityDTOMapper {
    @Override
    public Suggestion getSuggestion(SuggestionDTO dto) {
        if (dto == null){
            return null;
        }

        Suggestion suggestion = new Suggestion();
        try{
            suggestion.setUser(getUser(dto));
        }catch (Exception e){
            throw new RuntimeException(e);
        }
        suggestion.setId(dto.getId());
        suggestion.setMessage(dto.getMessage());
        suggestion.setPriority(dto.getPriority());
        suggestion.setFeeling(dto.getFeeling());
        return suggestion;
    }

    @Override
    public SuggestionDTO getSuggestionDTO(Suggestion suggestion) {
        if(suggestion == null){
            return null;
        }

        SuggestionDTO dto = new SuggestionDTO();

        dto.setUser(getUserId(suggestion.getUser()));
        dto.setId(suggestion.getId());
        dto.setMessage(suggestion.getMessage());
        dto.setPriority(suggestion.getPriority());
        dto.setFeeling(suggestion.getFeeling());
        return dto;
    }

    @Override
    public SuggestionUser getSuggestionUser(SuggestionUserDTO dto) {
        return null;
    }

    @Override
    public SuggestionUserDTO getSuggestionUserDTO(SuggestionUser suggestionUser) {
        return null;
    }
}
