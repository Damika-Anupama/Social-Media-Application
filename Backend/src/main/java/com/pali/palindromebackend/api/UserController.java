package com.pali.palindromebackend.api;

import com.pali.palindromebackend.dto.*;
import com.pali.palindromebackend.model.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 28/04/2021
 **/


public abstract class UserController implements SuperController {

    // send data to the profile page
    @GetMapping(value = "/info/{userId}")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public abstract ResponseEntity<?> getUserInfoForProfilePage(@PathVariable("userId") int userId);

    @GetMapping(value = "/picture/{id}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public abstract ResponseEntity<?> getUserProfilePicture(@PathVariable("id") int id);

    @GetMapping(value = "/name/{userName}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public abstract ResponseEntity<Object> getUserByName(@PathVariable("userName") String userName);

    @GetMapping(value = "/email/{email}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public abstract ResponseEntity<Object> getUserByEmail(@PathVariable("email") String email);

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(
            value = "/verify",
            consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public abstract ResponseEntity<?> verifyUser(@Valid @RequestBody VerifyObject obj);

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public abstract ResponseEntity<?> saveUser(@Valid @RequestBody UserDTO dto);

    @PutMapping(
            value = "/{userid}",
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public abstract ResponseEntity<?> updateUser(@ModelAttribute UserBody body, @PathVariable("userid") int userid);

    @PutMapping(value = "/logout")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public abstract void logoutUser(@ModelAttribute int userId);


    // TODO: 7/17/2022 Settle the error, when a user is logging to the application
    public abstract void updateUserLastLogin(UserBody body, int id);
}
