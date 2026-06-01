package com.pali.palindromebackend.api;

import com.pali.palindromebackend.dto.LoginDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 01/05/2021
 **/
public abstract class AuthenticateController {

    @PostMapping
    public abstract ResponseEntity<?> createAuthenticationToken(@RequestBody LoginDTO loginDTO);
}

