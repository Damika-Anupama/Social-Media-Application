package com.pali.palindromebackend.api;

import com.pali.palindromebackend.dto.FriendDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 15/06/2021
 **/

public abstract class FriendController implements SuperController{

    // FOR a friend request
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    @ResponseBody
    public abstract ResponseEntity<?> saveFriend(@Valid @RequestBody FriendDTO dto);

    @PutMapping(
            value = "/{friendshipId}",
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public abstract ResponseEntity<?> updateFriend(
            @Valid @RequestBody FriendDTO dto,
            @PathVariable("friendshipId") int friendshipId
    );
}
