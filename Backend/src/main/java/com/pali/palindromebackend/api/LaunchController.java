package com.pali.palindromebackend.api;

import com.pali.palindromebackend.entity.Launch;
import com.pali.palindromebackend.model.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 01/06/2021
 **/

abstract public class LaunchController implements SuperController{

    @PreAuthorize("permitAll()")
    @GetMapping(value = "/user/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public abstract ResponseEntity<?> getLaunchesByUserId(@PathVariable("userId") int userId) ;


    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @ResponseBody
    public abstract ResponseEntity<Launch> saveLaunch(@ModelAttribute LaunchBody body) ;

    @PutMapping(
            value = "/{launchId}",
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public abstract ResponseEntity<?> updateLaunch(@Valid @ModelAttribute LaunchBody body,
                                          @PathVariable("launchId") int launchId) ;
}
