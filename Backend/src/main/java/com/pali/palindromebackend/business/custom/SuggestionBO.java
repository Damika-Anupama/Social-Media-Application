package com.pali.palindromebackend.business.custom;

import com.pali.palindromebackend.business.SuperBO;
import com.pali.palindromebackend.dto.SuggestionDTO;
import com.pali.palindromebackend.dto.SuggestionUserDTO;

import java.util.List;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 19/06/2021
 **/
public interface SuggestionBO extends SuperBO {
    void saveSuggestion(SuggestionDTO dto);

    void updateSuggestion(SuggestionDTO dto);

    void deleteSuggestion(int suggestionId);

    List<SuggestionDTO> getAllSuggestions();

    List<SuggestionUserDTO> getAllSuggestionsWithUsers();

    SuggestionDTO getSuggestion(int suggestionId);
}
