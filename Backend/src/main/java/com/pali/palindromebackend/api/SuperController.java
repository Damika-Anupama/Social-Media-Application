package com.pali.palindromebackend.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * @author : Mr.Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 8/16/2022
 **/
public interface SuperController {
    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    ResponseEntity<?> findById(@PathVariable("id") int id);

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    ResponseEntity<?> findAll();

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    @ResponseBody
    ResponseEntity<?> deleteById(@PathVariable("id") int id);
}
