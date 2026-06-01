package com.pali.palindromebackend.api;

import com.pali.palindromebackend.dto.SuggestionDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 19/06/2021
 **/

public abstract class SuggestionController implements SuperController{

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE, value = "/user")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public abstract ResponseEntity<?> getAllSuggestionsWithUsers();

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    @ResponseBody
    public abstract ResponseEntity<?> saveSuggestion(@Valid @RequestBody SuggestionDTO dto);

    @PutMapping(
            value = "/{suggestionId}",
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public abstract ResponseEntity<?> updateSuggestion(
            @Valid @RequestBody SuggestionDTO dto,
            @PathVariable("suggestionId") int suggestionId);
}
