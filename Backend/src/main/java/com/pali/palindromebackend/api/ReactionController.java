package com.pali.palindromebackend.api;

import com.pali.palindromebackend.dto.ReactionDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 10/05/2022
 **/

public abstract class ReactionController implements SuperController{

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @ResponseBody
    public abstract ResponseEntity<?> saveReaction(ReactionDTO dto);

    @PutMapping(
            value = "/{ReactionId}",
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public abstract ResponseEntity<?> updateReaction(@Valid @RequestBody ReactionDTO dto, @PathVariable("ReactionId") int ReactionId);
}
